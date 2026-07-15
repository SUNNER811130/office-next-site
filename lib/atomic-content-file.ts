import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { ContentStorageMutationError } from "@/lib/content-workflow-errors";

export interface AtomicContentFileHandle {
  writeFile(data: string, encoding: "utf8"): Promise<void>;
  sync(): Promise<void>;
  close(): Promise<void>;
}

export interface AtomicContentFileSystem {
  mkdir(directory: string, options: { recursive: true }): Promise<unknown>;
  open(filePath: string, flags: "wx"): Promise<AtomicContentFileHandle>;
  rename(from: string, to: string): Promise<void>;
  unlink(filePath: string): Promise<void>;
}

const nodeAtomicContentFileSystem: AtomicContentFileSystem = {
  mkdir: (directory, options) => fs.mkdir(directory, options),
  open: (filePath, flags) => fs.open(filePath, flags),
  rename: (from, to) => fs.rename(from, to),
  unlink: (filePath) => fs.unlink(filePath)
};

let tempSequence = 0;

function defaultTempToken(): string {
  tempSequence += 1;
  return `${process.pid}-${tempSequence}-${randomUUID()}`;
}

export type AtomicContentFileOptions = {
  fileSystem?: AtomicContentFileSystem;
  createTempToken?: () => string;
};

export async function atomicReplaceJson(
  persistencePath: string,
  value: unknown,
  options: AtomicContentFileOptions = {}
): Promise<void> {
  const resolvedPath = path.resolve(persistencePath);
  const directory = path.dirname(resolvedPath);
  const fileName = path.basename(resolvedPath);
  const fileSystem = options.fileSystem ?? nodeAtomicContentFileSystem;
  const token = (options.createTempToken ?? defaultTempToken)();

  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    throw new ContentStorageMutationError(fileName, new Error("Unsafe atomic temp token"));
  }

  const tempPath = path.join(directory, `.${fileName}.tmp-${token}`);
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  let handle: AtomicContentFileHandle | undefined;

  try {
    await fileSystem.mkdir(directory, { recursive: true });
    handle = await fileSystem.open(tempPath, "wx");
    await handle.writeFile(serialized, "utf8");
    await handle.sync();
    await handle.close();
    handle = undefined;
    await fileSystem.rename(tempPath, resolvedPath);
  } catch (error: unknown) {
    if (handle) {
      try {
        await handle.close();
      } catch {
        // Preserve the primary mutation error.
      }
    }
    try {
      await fileSystem.unlink(tempPath);
    } catch {
      // Cleanup is best effort and must not hide the primary mutation error.
    }
    if (error instanceof ContentStorageMutationError) throw error;
    throw new ContentStorageMutationError(fileName, error);
  }
}
