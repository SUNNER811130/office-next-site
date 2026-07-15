import path from "path";

const mutationQueues = new Map<string, Promise<void>>();

export async function runSerializedContentMutation<TResult>(
  persistencePath: string,
  mutation: () => Promise<TResult>
): Promise<TResult> {
  const key = path.resolve(persistencePath);
  const previous = mutationQueues.get(key) ?? Promise.resolve();
  let release: () => void = () => undefined;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });

  mutationQueues.set(key, current);
  await previous;

  try {
    return await mutation();
  } finally {
    release();
    if (mutationQueues.get(key) === current) {
      mutationQueues.delete(key);
    }
  }
}
