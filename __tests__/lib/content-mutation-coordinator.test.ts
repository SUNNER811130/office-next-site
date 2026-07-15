import { runSerializedContentMutation } from "@/lib/content-mutation-coordinator";

function deferred() {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("content mutation coordinator", () => {
  it("serializes critical sections for the same resolved path", async () => {
    const entered = deferred();
    const release = deferred();
    const order: string[] = [];

    const first = runSerializedContentMutation("./data/../data/fixture.json", async () => {
      order.push("first-enter");
      entered.resolve();
      await release.promise;
      order.push("first-exit");
    });
    await entered.promise;
    const second = runSerializedContentMutation("./data/fixture.json", async () => {
      order.push("second-enter");
    });

    await Promise.resolve();
    expect(order).toEqual(["first-enter"]);
    release.resolve();
    await Promise.all([first, second]);
    expect(order).toEqual(["first-enter", "first-exit", "second-enter"]);
  });

  it("continues the queue after a rejected mutation", async () => {
    const first = runSerializedContentMutation("failure-fixture.json", async () => {
      throw new Error("first failed");
    });
    const second = runSerializedContentMutation("failure-fixture.json", async () => "second succeeded");

    await expect(first).rejects.toThrow("first failed");
    await expect(second).resolves.toBe("second succeeded");
  });
});
