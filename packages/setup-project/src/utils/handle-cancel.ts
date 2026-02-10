import { cancel, isCancel, confirm } from "@clack/prompts";

export async function handleCancel<T>(
  response: T | symbol,
  message: string = "Operation cancelled.",
): Promise<T> {
  if (isCancel(response)) {
    const shouldCancel = await confirm({
      message: "Do you really want to cancel?",
    });

    if (shouldCancel) {
      cancel(message);
      process.exit(1);
    }

    cancel(message);
    process.exit(0);
  }
  return response as T;
}

export async function withCancelHandling<T>(
  promptFn: () => Promise<T | symbol>,
  cancelMessage: string = "Operation cancelled.",
): Promise<T> {
  while (true) {
    const response = await promptFn();

    if (isCancel(response)) {
      const shouldCancel = await confirm({
        message: "Do you really want to cancel options selection?",
      });

      if (isCancel(shouldCancel) || shouldCancel) {
        cancel(cancelMessage);
        process.exit(0);
      }

      continue;
    } else {
      return response as T;
    }
  }
}
