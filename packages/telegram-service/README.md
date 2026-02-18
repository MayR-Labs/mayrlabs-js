# @mayrlabs/telegram-service

A powerful, abstract Telegram bot service wrapper for MayR Labs applications. This package simplifies the creation of Telegram notification services by handling bot creation, error handling, and message dispatching.

## Features

- **Abstract Service Pattern**: Easily create new notification services by extending `TelegramService`.
- **Environment Driven**: Configured via environment variables for security and flexibility.
- **Built-in CLI**: Interactive CLI tool to generate new service classes and send test messages.
- **Robust Error Handling**: Integrated with `@mayrlabs/debugger` for consistent logging.
- **Type Safe**: Written in TypeScript with full type definitions.

## Installation

```bash
npm install @mayrlabs/telegram-service
# or
yarn add @mayrlabs/telegram-service
# or
pnpm add @mayrlabs/telegram-service
```

## Quick Start

### 1. Configuration

Ensure the following environment variables are set in your project:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_DEFAULT_CHAT_IDS=123456789,987654321
ENABLE_TELEGRAM_NOTIFICATIONS=true
```

### 2. Create a Service

You can use the CLI to generate a new service class:

```bash
npx @mayrlabs/telegram-service
```

Select "Create new service class" and follow the prompts.

Or manually extend the `TelegramService` class:

```typescript
import { TelegramService } from "@mayrlabs/telegram-service";

interface UserSignupData {
  username: string;
  email: string;
}

export class UserSignupNotification extends TelegramService<UserSignupData> {
  protected formatMessage(data: UserSignupData): string {
    return [
      "🎉 *New User Signup*",
      "",
      `Username: \`${data.username}\``,
      `Email: \`${data.email}\``,
    ].join("\n");
  }
}

export const userSignupNotification = new UserSignupNotification();
```

### 3. Send Notifications

```typescript
await userSignupNotification.sendNotification({
  username: "johndoe",
  email: "john@example.com",
});
```

## CLI Tool

The package comes with a CLI to help you manage your services.

```bash
npx telegram-service
```

**Features:**

- **Create new service class**: Generates a boilerplate TypeScript class for a new service.
- **Send test message**: Sends a test message to your configured `TELEGRAM_DEFAULT_CHAT_IDS` to verify your bot token and chat IDs are correct.

## API Reference

### `TelegramService<T>`

Abstract class to be extended.

#### Methods

- `protected abstract formatMessage(data: T): string`: Must be implemented. Formats the data into a Markdown string for the Telegram message.
- `public async sendNotification(data: T, chatIds?: string[], options?: TelegramBot.SendMessageOptions): Promise<TelegramOperationResult>`: Sends the notification.
  - `data`: The data object expected by `formatMessage`.
  - `chatIds`: Optional array of chat IDs to override defaults.
  - `options`: Optional `node-telegram-bot-api` options (e.g., for disabling web previews).

### `TelegramOperationResult`

```typescript
interface TelegramOperationResult {
  success: boolean;
  error?: string;
}
```

## License

MIT
