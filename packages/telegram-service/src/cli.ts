#!/usr/bin/env node
import {
  intro,
  outro,
  select,
  text,
  multiselect,
  isCancel,
  note,
} from "@clack/prompts";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { TelegramService } from "./index";

dotenv.config();

class TestTelegramService extends TelegramService<string> {
  protected formatMessage(data: string): string {
    return data;
  }
}

const testService = new TestTelegramService();

async function main() {
  console.clear();
  intro(`@mayrlabs/telegram-service CLI`);

  while (true) {
    const action = await select({
      message: "What would you like to do?",
      options: [
        { value: "create", label: "Create new service class" },
        { value: "test", label: "Send test message" },
        { value: "exit", label: "Exit" },
      ],
    });

    if (isCancel(action) || action === "exit") {
      outro("Goodbye!");
      process.exit(0);
    }

    if (action === "create") {
      await createServiceClass();
    } else if (action === "test") {
      await sendTestMessage();
    }
  }
}

async function createServiceClass() {
  const className = await text({
    message: "Enter the class name (e.g., RegistrationTelegramService)",
    placeholder: "RegistrationTelegramService",
    validate: (value) => {
      if (!value) return "Class name is required";
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value))
        return "Class name must be PascalCase";
    },
  });

  if (isCancel(className)) return;

  const location = await text({
    message: "Where should the file be created?",
    placeholder: "./src/services/telegram/RegistrationTelegramService.ts",
    initialValue: `./${className}.ts`,
  });

  if (isCancel(location)) return;

  const instanceName =
    className.toString().charAt(0).toLowerCase() +
    className.toString().slice(1);

  const content = `import { TelegramService } from "@mayrlabs/telegram-service";

export interface ${className}Data {
  content: string;
  // Add your custom data properties here
}

export class ${className} extends TelegramService<${className}Data> {
  protected formatMessage(data: ${className}Data): string {
    const lines = [
      "",
      data.content,
      "",
      \`⏰ *Received:* _\${new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Lagos",
      })}_\`,
    ];

    return lines.join("\\n");
  }
}

export const ${instanceName} = new ${className}();
`;

  const absolutePath = path.resolve(process.cwd(), location.toString());
  const dir = path.dirname(absolutePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(absolutePath, content);

  note(`Created ${className} at ${location}`, "Success");
}

async function sendTestMessage() {
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
