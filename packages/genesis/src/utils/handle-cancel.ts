import { prompts } from "@/utils/prompts";

export async function handleCancel<T>(
  response: T | symbol,
  message: string = "Operation cancelled."
): Promise<T> {
  if (prompts.isCancel(response)) {
    const shouldCancel = await prompts.confirm({
      message: "Do you really want to cancel?",
    });

    if (shouldCancel) {
      prompts.cancel(message);
      process.exit(1);
    }

    prompts.cancel(message);
    process.exit(0);
  }
  return response as T;
}

export async function withCancelHandling<T>(
  promptFn: () => Promise<T | symbol>,
  cancelMessage: string = "Operation cancelled."
): Promise<T> {
  while (true) {
    const response = await promptFn();

    if (prompts.isCancel(response)) {
      const shouldCancel = await prompts.confirm({
        message: "Do you really want to cancel?",
      });

      if (prompts.isCancel(shouldCancel) || shouldCancel) {
        prompts.cancel(cancelMessage);
        process.exit(0);
      }

      continue;
    } else {
      return response as T;
    }
  }
}
