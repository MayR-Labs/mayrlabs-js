#!/usr/bin/env node

import { program } from "commander";
import pc from "picocolors";
import { configure } from "@/cli/commands/configure";
import { TOOL_OPTIONS } from "@/constants/options";
import { config } from "@/core/config";
import type { Tool } from "@/core/types";
import { promptEditorConfig } from "@/features/editor-config";
import { promptEnv } from "@/features/env";
import { promptFormatter } from "@/features/formatter";
import { promptHusky } from "@/features/husky";
import { promptLicense } from "@/features/license";
import { promptLintStaged } from "@/features/lint-staged";
import { promptLinter } from "@/features/linter";
import { promptTest } from "@/features/test";
import { execution } from "@/steps/execution";
import gitCheck from "@/steps/git-check";
import { showAbout, showManual, showVisit } from "@/utils/display.js";
import { withCancelHandling } from "@/utils/handle-cancel";
import { logError } from "@/utils/logger";
import { prompts } from "@/utils/prompts";
import { introScreen } from "../utils/intro.js";

async function main() {
  try {
    introScreen();

    prompts.intro(
      pc.inverse(pc.bold(pc.cyan(" Welcome to the Project Setup Wizard "))),
    );

    await gitCheck();

    const tools = (await withCancelHandling(async () =>
      prompts.multiselect({
        message: "Select tools to configure:",
        options: TOOL_OPTIONS,
        required: false,
      }),
    )) as string[] as Tool[];

    tools.forEach((tool) => {
      config.enableTool(tool);
    });

    if (config.get("husky").selected) await promptHusky(config);
    if (config.get("formatter").selected) await promptFormatter(config);
    if (config.get("linter").selected) await promptLinter(config);
    if (config.get("lintStaged").selected) await promptLintStaged(config);
    if (config.get("env").selected) await promptEnv(config);
    if (config.get("test").selected) await promptTest(config);
    if (config.get("editorConfig").selected) await promptEditorConfig(config);
    if (config.get("license").selected) await promptLicense(config);

    prompts.note(config.summary, "Configuration Summary");

    const proceed = (await withCancelHandling(async () =>
      prompts.confirm({
        message: "Do you want to proceed with the installation?",
      }),
    )) as boolean;

    if (!proceed) {
      prompts.outro(pc.yellow("Installation cancelled."));
      process.exit(0);
    }

    await execution(config);

    prompts.outro(pc.green("Setup complete!"));
  } catch (error) {
    const logPath = await logError(error);

    prompts.outro(
      pc.red(`\nSomething went wrong!\nError log saved to: ${logPath}`),
    );

    process.exit(1);
  }
}

program.helpOption(false);

program
  .name("genesis")
  .description("Interactive CLI to setup project tools")
  .option("-a, --about", "Show project details")
  .option("-v, --version", "Show version info")
  .option("-V, --visit", "Visit project homepage")
  .option("-h, --help", "Show help");

// Commands
program.command("about").action(() => {
  showAbout();
  process.exit(0);
});

program.command("version").action(() => {
  introScreen();
  process.exit(0);
});

program.command("visit").action(() => {
  showVisit();
  process.exit(0);
});

program.command("help").action(() => {
  showManual();
  process.exit(0);
});

program
  .command("configure [tool]")
  .description("Configure a specific tool")
  .action(async (tool) => {
    await configure(tool);

    process.exit(0);
  });

// Root action
program.action(async (options) => {
  if (options.about) {
    showAbout();
    process.exit(0);
  }
  if (options.version) {
    introScreen();
    process.exit(0);
  }
  if (options.visit) {
    showVisit();
    process.exit(0);
  }
  if (options.help) {
    showManual();
    process.exit(0);
  }

  await main();
});

program.parse();
