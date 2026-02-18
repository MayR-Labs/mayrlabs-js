import { multiselect, text, isCancel, note } from "@clack/prompts";
import { TelegramService } from "@/core/TelegramService";

// Internal test service implementation
class TestTelegramService extends TelegramService<string> {
  protected formatMessage(data: string): string {
    return data;
  }
}

const testService = new TestTelegramService();

export async function sendTestMessage() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsString = process.env.TELEGRAM_DEFAULT_CHAT_IDS;

  if (!token) {
    note("TELEGRAM_BOT_TOKEN env var is missing", "Error");
    return;
  }

  if (!chatIdsString) {
    note("TELEGRAM_DEFAULT_CHAT_IDS env var is missing", "Error");
    return;
  }

  const allChatIds = chatIdsString
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (allChatIds.length === 0) {
    note("No valid chat IDs found in TELEGRAM_DEFAULT_CHAT_IDS", "Error");
    return;
  }

  const selectedChatIds = await multiselect({
    message: "Select recipients (Space to select, Enter to confirm)",
    options: allChatIds.map((id) => ({ value: id, label: id })),
    required: true,
  });

  if (isCancel(selectedChatIds)) return;

  const message = await text({
    message: "Enter message content",
    initialValue:
      "🔔 This is a test message from @mayrlabs/telegram-service CLI",
  });

  if (isCancel(message)) return;

  const spinner = {
    start: () => process.stdout.write("Sending... "),
    stop: () => process.stdout.write("Done!\n"),
  };

  spinner.start();
  const result = await testService.sendNotification(
    message.toString(),
    selectedChatIds as string[]
  );
  spinner.stop();

  if (result.success) {
    note("Message sent successfully!", "Success");
  } else {
    note(`Failed to send message: ${result.error}`, "Error");
  }
}
