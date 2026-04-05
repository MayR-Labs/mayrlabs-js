#!/usr/bin/env node
import { intro, isCancel, outro, select } from "@clack/prompts";
import dotenv from "dotenv";
import { createServiceClass } from "./cli/commands/create-service";
import { sendTestMessage } from "./cli/commands/send-test";

dotenv.config();

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
