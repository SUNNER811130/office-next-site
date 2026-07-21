import { promises as fs } from "fs";
import os from "os";
import path from "path";

import { siteContentSeed } from "@/data/site-content.seed";
import { createEnvelopeFromLegacy } from "@/lib/content-envelope";
import { LocalFileContentWorkflowRepository } from "@/lib/content-workflow-repository";
import { defineContentWorkflowRepositoryContract } from "@/test-utils/content-workflow-repository-contract";

defineContentWorkflowRepositoryContract("Local File", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "office-next-contract-"));
  const persistencePath = path.join(directory, "site-content.json");
  const baseline = createEnvelopeFromLegacy(siteContentSeed, "2026-07-20T00:00:00.000Z");
  await fs.writeFile(persistencePath, JSON.stringify(baseline, null, 2), "utf8");

  const createRepository = () => new LocalFileContentWorkflowRepository({
    persistencePath,
    seed: siteContentSeed
  });

  return {
    repository: createRepository(),
    createPeerRepository: createRepository,
    baselineContent: baseline.published.content,
    cleanup: async () => {
      await fs.rm(directory, { recursive: true, force: true });
    }
  };
});
