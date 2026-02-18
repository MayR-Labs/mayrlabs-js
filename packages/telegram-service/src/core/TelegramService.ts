import TelegramBot from "node-telegram-bot-api";
import { Debugger } from "@mayrlabs/debugger";
import { TelegramOperationResult } from "@/contracts";

const error = (error: string): TelegramOperationResult => ({
  success: false,
  error,
});

const success = (): TelegramOperationResult => ({ success: true });

const _debug = new Debugger("TelegramService").devOnly();

export abstract class TelegramService<T> {
  protected abstract formatMessage(data: T): string;

  protected isEnabled(): boolean {
    const enabled = process.env.ENABLE_TELEGRAM_NOTIFICATIONS;
    const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;

    return (!!enabled && hasToken) || false;
  }

  protected getDefaultChatIds(): string[] {
    const chatIdsString = process.env.TELEGRAM_DEFAULT_CHAT_IDS || "";

    return chatIdsString
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }

  protected createBot(): TelegramBot | null {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      _debug.error("Telegram bot token not provided");
      return null;
    }

    try {
      return new TelegramBot(token, { polling: false });
    } catch (error) {
      _debug.error("Error creating Telegram bot:", error);
      return null;
    }
  }

  public async sendNotification(
    data: T,
    chatIds?: string[] | null,
    options?: TelegramBot.SendMessageOptions
  ): Promise<TelegramOperationResult> {
    if (!this.isEnabled()) {
      return error("Telegram notifications are not enabled");
    }

    const bot = this.createBot();

    if (!bot) return error("Failed to create Telegram bot instance");

    const targetChatIds =
      chatIds && chatIds.length > 0 ? chatIds : this.getDefaultChatIds();

    if (targetChatIds.length === 0) return error("No chat IDs configured");

    const message = this.formatMessage(data);
    const errors: string[] = [];

    let successCount = 0;

    for (const chatId of targetChatIds) {
      try {
        await bot.sendMessage(
          chatId,
          message,
          options || {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          }
        );

        successCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);

        _debug.error(`Failed to send to chat ID ${chatId}:`, errorMsg);

        errors.push(`Chat ${chatId}: ${errorMsg}`);
      }
    }

    if (successCount === 0) {
      return error(`Failed to send to all chat IDs: ${errors.join("; ")}`);
    }

    if (errors.length > 0) {
      return error(`Partial success. Failed for: ${errors.join("; ")}`);
    }

    return success();
  }
}
