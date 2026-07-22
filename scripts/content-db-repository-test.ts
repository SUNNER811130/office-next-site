import { randomBytes } from "crypto";
import { execFileSync, spawnSync } from "child_process";
import path from "path";

import { Client, Pool } from "pg";

import { MigrationRunner } from "../database/migration-runner";
import { verifyContentSchema } from "../database/schema-verifier";

function docker(args: readonly string[]): string {
  return execFileSync("docker", [...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

async function waitForPostgres(containerName: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      docker(["exec", containerName, "pg_isready", "-U", "postgres"]);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("PostgreSQL readiness timed out");
}

const retryableConnectionErrors: ReadonlySet<string> = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
  "57P03"
]);

const retryableMessageCategories: ReadonlySet<string> = new Set([
  "PG_CONNECTION_TERMINATED",
  "PG_CONNECTION_TIMEOUT",
  "PG_STARTING_UP"
]);

const nonRetryableDatabaseErrors: ReadonlySet<string> = new Set([
  "28P01",
  "3D000",
  "42501",
  "42P01",
  "42601",
  "23505"
]);

type ReadinessPhase = "connect" | "query" | "cleanup";

type ReadinessErrorSignals = {
  names: string[];
  codes: string[];
  messageCategories: string[];
};

type ContainerHealth = {
  running: boolean;
  exitCode: number;
  oomKilled: boolean;
  restartCount: number;
};

function safeMessageCategory(message: string): string | undefined {
  const normalized = message.trim().toLowerCase();
  if (normalized === "connection terminated unexpectedly") return "PG_CONNECTION_TERMINATED";
  if (normalized === "connection terminated due to connection timeout") return "PG_CONNECTION_TIMEOUT";
  if (normalized === "the database system is starting up") return "PG_STARTING_UP";
  return undefined;
}

function collectReadinessErrorSignals(error: unknown): ReadinessErrorSignals {
  const names = new Set<string>();
  const codes = new Set<string>();
  const messageCategories = new Set<string>();
  const seen = new Set<object>();

  function visit(value: unknown, depth: number): void {
    if (depth > 4 || typeof value !== "object" || value === null || seen.has(value)) return;
    seen.add(value);

    if (
      "name" in value &&
      typeof value.name === "string" &&
      /^[A-Za-z][A-Za-z0-9]{0,63}$/.test(value.name)
    ) {
      names.add(value.name);
    }
    if (
      "code" in value &&
      typeof value.code === "string" &&
      /^[A-Z0-9_]{2,32}$/.test(value.code)
    ) {
      codes.add(value.code);
    }
    if ("message" in value && typeof value.message === "string") {
      const category = safeMessageCategory(value.message);
      if (category) messageCategories.add(category);
    }
    if ("errors" in value && Array.isArray(value.errors)) {
      for (const nestedError of value.errors) visit(nestedError, depth + 1);
    }
    if ("cause" in value) visit(value.cause, depth + 1);
  }

  visit(error, 0);
  return {
    names: Array.from(names),
    codes: Array.from(codes),
    messageCategories: Array.from(messageCategories)
  };
}

function inspectContainerHealth(containerName: string): ContainerHealth {
  const output = docker([
    "inspect",
    "--format",
    "{{.State.Running}} {{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}",
    containerName
  ]);
  const [running, exitCode, oomKilled, restartCount] = output.split(/\s+/);
  return {
    running: running === "true",
    exitCode: Number.parseInt(exitCode ?? "-1", 10),
    oomKilled: oomKilled === "true",
    restartCount: Number.parseInt(restartCount ?? "-1", 10)
  };
}

function isContainerHealthy(health: ContainerHealth): boolean {
  return health.running && health.exitCode === 0 && !health.oomKilled && health.restartCount === 0;
}

function isInternalPostgresReady(containerName: string): boolean {
  try {
    docker(["exec", containerName, "pg_isready", "-U", "postgres"]);
    return true;
  } catch {
    return false;
  }
}

async function probePostgresHost(connectionString: string): Promise<{
  error: unknown;
  phase: ReadinessPhase;
} | undefined> {
  const client = new Client({ connectionString, connectionTimeoutMillis: 1_500 });
  let primaryError: unknown;
  let phase: ReadinessPhase = "connect";
  let probeSucceeded = false;

  try {
    await client.connect();
    phase = "query";
    await client.query("SELECT 1");
    probeSucceeded = true;
  } catch (error: unknown) {
    primaryError = error;
  } finally {
    try {
      await client.end();
    } catch (cleanupError: unknown) {
      if (primaryError === undefined && probeSucceeded) {
        primaryError = cleanupError;
        phase = "cleanup";
      }
    }
  }

  return primaryError === undefined ? undefined : { error: primaryError, phase };
}

function safeReadinessFailureSummary(
  phase: ReadinessPhase,
  signals: ReadinessErrorSignals,
  attempt: number,
  containerRunning: boolean,
  internalPgReady: boolean
): string {
  return [
    `phase=${phase}`,
    `name=${signals.names.join(",") || "Unknown"}`,
    `codes=${signals.codes.join(",") || "NONE"}`,
    `messageCategory=${signals.messageCategories.join(",") || "NONE"}`,
    `attempt=${attempt}`,
    `containerRunning=${containerRunning}`,
    `internalPgReady=${internalPgReady}`
  ].join(" ");
}

async function waitForPostgresHostConnection(
  connectionString: string,
  containerName: string,
  allowRetry: boolean,
  timeoutMs = 60_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let attempts = 0;
  let lastClassification = "UNKNOWN_UNCLASSIFIED";
  let delayMs = 250;

  while (Date.now() < deadline) {
    attempts += 1;
    const failure = await probePostgresHost(connectionString);
    if (!failure) {
      console.log(`PostgreSQL host readiness passed after ${attempts} attempt(s)`);
      return;
    }

    const signals = collectReadinessErrorSignals(failure.error);
    let health: ContainerHealth;
    try {
      health = inspectContainerHealth(containerName);
    } catch {
      throw new Error("POSTGRES_CONTAINER_UNHEALTHY");
    }
    const internalPgReady = health.running && isInternalPostgresReady(containerName);
    const summary = safeReadinessFailureSummary(
      failure.phase,
      signals,
      attempts,
      health.running,
      internalPgReady
    );

    if (!isContainerHealthy(health)) {
      throw new Error(`POSTGRES_CONTAINER_UNHEALTHY ${summary}`);
    }
    if (signals.codes.length === 0 && signals.messageCategories.length === 0) {
      throw new Error(`UNKNOWN_UNCLASSIFIED ${summary}`);
    }

    if (signals.codes.some((code) => nonRetryableDatabaseErrors.has(code))) {
      throw new Error(`PostgreSQL host readiness failed with non-retryable signal ${summary}`);
    }
    const hasRetryableCode = signals.codes.some((code) => retryableConnectionErrors.has(code));
    const hasRetryableMessage = signals.messageCategories.some((category) =>
      retryableMessageCategories.has(category)
    );
    if (!allowRetry || (!hasRetryableCode && !hasRetryableMessage)) {
      throw new Error(`PostgreSQL host readiness failed with non-retryable signal ${summary}`);
    }

    lastClassification = signals.codes.join(",") || signals.messageCategories.join(",");
    console.warn(`PostgreSQL host readiness retry: ${summary}`);
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(delayMs, remainingMs)));
    delayMs = Math.min(delayMs * 2, 1_000);
  }

  throw new Error(
    `PostgreSQL host readiness timed out after ${attempts} attempts; last classification ${lastClassification}`
  );
}

async function run(): Promise<void> {
  const identity = `${Date.now()}-${process.pid}-${randomBytes(4).toString("hex")}`;
  const containerName = `office-next-l8b3-${identity}`;
  const databaseName = `office_next_l8b3_${randomBytes(4).toString("hex")}`;
  const password = randomBytes(24).toString("base64url");
  let pool: Pool | undefined;

  try {
    docker([
      "run", "-d", "--name", containerName,
      "--label", "office-next-l8b3-test",
      "-e", `POSTGRES_PASSWORD=${password}`,
      "-e", `POSTGRES_DB=${databaseName}`,
      "-p", "127.0.0.1::5432",
      "postgres:17-alpine"
    ]);
    await waitForPostgres(containerName);
    const portOutput = docker(["port", containerName, "5432/tcp"]);
    const port = Number.parseInt(portOutput.slice(portOutput.lastIndexOf(":") + 1), 10);
    if (!Number.isInteger(port)) throw new Error("Docker did not return a PostgreSQL host port");

    const testUrl = `postgresql://postgres:${encodeURIComponent(password)}@127.0.0.1:${port}/${databaseName}`;
    await waitForPostgresHostConnection(testUrl, containerName, true);
    pool = new Pool({ connectionString: testUrl });
    const runner = new MigrationRunner(pool, path.resolve(process.cwd(), "database/migrations"));
    await runner.up();
    const client = await pool.connect();
    try {
      await verifyContentSchema(client);
    } finally {
      client.release();
    }
    await pool.end();
    pool = undefined;
    await waitForPostgresHostConnection(testUrl, containerName, false);

    const childEnvironment: NodeJS.ProcessEnv = {
      ...process.env,
      CONTENT_DATABASE_TEST_URL: testUrl
    };
    delete childEnvironment.CONTENT_DATABASE_MIGRATION_URL;
    const result = spawnSync(
      "npx",
      ["jest", "--config", "jest.database.config.ts", "--runInBand"],
      { cwd: process.cwd(), env: childEnvironment, stdio: "inherit" }
    );
    if (result.error || result.status !== 0) {
      throw new Error("Database repository contract tests failed");
    }
    console.log("PostgreSQL repository integration tests passed");
  } finally {
    if (pool) await pool.end().catch(() => undefined);
    try { docker(["rm", "-f", containerName]); } catch { /* container may not exist */ }
  }
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown repository integration failure";
  console.error(message.slice(0, 300));
  process.exitCode = 1;
});
