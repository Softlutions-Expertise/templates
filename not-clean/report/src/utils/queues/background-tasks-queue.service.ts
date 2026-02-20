import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 2 });
queue.on("idle", () => {});
queue.on("active", () => {});

class BackgroundTasksManager {
  queue = new PQueue({ concurrency: 5, interval: 500 });

  async enqueue<T>(task: () => Promise<T>): Promise<T | undefined> {
    return queue.add(task) as Promise<T | undefined>;
  }
}

export const backgroundTasksManager = new BackgroundTasksManager();
