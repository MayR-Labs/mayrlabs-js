import { Debugger } from "@mayrlabs/debugger";
import TelegramBot from "node-telegram-bot-api";
import type { TelegramOperationResult } from "@/contracts";

const error = (error: string): TelegramOperationResult => ({
  success: false,
  error,
});

const success = (): TelegramOperationResult => ({ success: true });

const _debug = new Debugger("TelegramService").devOnly();

/**
 * Abstract base class for creating Telegram notification services.
 * Extend this class to implement custom message formatting and logic.
 *
 * @template T The type of data payload used to generate the message.
 */
export abstract class TelegramService<T> {
  /**
   * Formats the data into a string message to be sent to Telegram.
   *
   * @param data The data payload.
   * @returns The formatted message string (Markdown by default).
   */
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

  /**
   * Sends a notification to the specified chat IDs or default chat IDs.
   *
   * @param data The data payload to format and send.
   * @param chatIds Optional array of chat IDs to send to. If not provided or empty, uses `TELEGRAM_DEFAULT_CHAT_IDS`.
   * @param options Optional `node-telegram-bot-api` SendMessageOptions. Defaults to Markdown parse mode and disabled web preview.
   * @returns A promise resolving to the operation result.
   */
  public async sendNotification(
    data: T,
    chatIds?: string[] | null,
    options?: TelegramBot.SendMessageOptions,
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
          },
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
