import { promises as fs } from "fs";
import os from "os";
import path from "path";

import {
  atomicReplaceJson,
  type AtomicContentFileHandle,
  type AtomicContentFileSystem
} from "@/lib/atomic-content-file";
import { ContentStorageMutationError } from "@/lib/content-workflow-errors";

async function fixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-atomic-"));
  const persistencePath = path.join(directory, "content.json");
  await fs.writeFile(persistencePath, "ORIGINAL\n", "utf8");
  return { directory, persistencePath };
}

type AtomicObservations = { tempPath?: string; cleanupAttempts: number };

function injectedFileSystem(
  failAt?: "write" | "sync" | "rename" | "cleanup",
  observations: AtomicObservations = { cleanupAttempts: 0 }
): AtomicContentFileSystem {
  return {
    mkdir: (directory, options) => fs.mkdir(directory, options),
    async open(filePath, flags) {
      observations.tempPath = filePath;
      const handle = await fs.open(filePath, flags);
      const adapter: AtomicContentFileHandle = {
        async writeFile(data, encoding) {
          if (failAt === "write") throw new Error("write failed");
          await handle.writeFile(data, encoding);
        },
        async sync() {
          if (failAt === "sync") throw new Error("sync failed");
          await handle.sync();
        },
        close: () => handle.close()
      };
      return adapter;
    },
    async rename(from, to) {
      if (failAt === "rename") throw new Error("rename failed");
      await fs.rename(from, to);
    },
    async unlink(filePath) {
      observations.cleanupAttempts += 1;
      if (failAt === "cleanup") throw new Error("cleanup failed");
      await fs.unlink(filePath);
    }
  };
}

describe("atomic content file", () => {
  it("writes complete newline-terminated JSON via a same-directory temp file", async () => {
    const target = await fixture();
    const observations: AtomicObservations = { cleanupAttempts: 0 };
    await atomicReplaceJson(target.persistencePath, { ok: true }, {
      fileSystem: injectedFileSystem(undefined, observations),
      createTempToken: () => "success"
    });

    expect(await fs.readFile(target.persistencePath, "utf8")).toBe('{\n  "ok": true\n}\n');
    expect(path.dirname(observations.tempPath ?? "")).toBe(target.directory);
    expect(path.basename(observations.tempPath ?? "")).toBe(".content.json.tmp-success");
  });

  it.each(["write", "sync", "rename"] as const)(
    "preserves the target and cleans the known temp after %s failure",
    async (failAt) => {
      const target = await fixture();
      const observations: AtomicObservations = { cleanupAttempts: 0 };
      await expect(atomicReplaceJson(target.persistencePath, { ok: false }, {
        fileSystem: injectedFileSystem(failAt, observations),
        createTempToken: () => failAt
      })).rejects.toBeInstanceOf(ContentStorageMutationError);

      expect(await fs.readFile(target.persistencePath, "utf8")).toBe("ORIGINAL\n");
      expect(observations.cleanupAttempts).toBe(1);
      await expect(fs.access(observations.tempPath ?? "")).rejects.toMatchObject({ code: "ENOENT" });
    }
  );

  it("does not let cleanup failure hide the primary write error", async () => {
    const target = await fixture();
    const fileSystem = injectedFileSystem("cleanup");
    const originalOpen = fileSystem.open;
    fileSystem.open = async (filePath, flags) => {
      const handle = await originalOpen(filePath, flags);
      return {
        ...handle,
        writeFile: async () => {
          throw new Error("primary write failure");
        }
      };
    };

    const error = await atomicReplaceJson(target.persistencePath, { ok: false }, {
      fileSystem,
      createTempToken: () => "cleanup-failure"
    }).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ContentStorageMutationError);
    expect((error as Error & { cause?: Error }).cause?.message).toBe("primary write failure");
    expect(await fs.readFile(target.persistencePath, "utf8")).toBe("ORIGINAL\n");
  });

  it("rejects temp tokens that could escape the persistence directory", async () => {
    const target = await fixture();
    await expect(atomicReplaceJson(target.persistencePath, {}, {
      createTempToken: () => "../escape"
    })).rejects.toBeInstanceOf(ContentStorageMutationError);
    expect(await fs.readFile(target.persistencePath, "utf8")).toBe("ORIGINAL\n");
  });
});
