#!/usr/bin/env node

import { outro, multiselect, note, confirm } from "@clack/prompts";
import pc from "picocolors";
import { program } from "commander";
import { promptHusky } from "@/services/husky";
import { promptFormatter } from "@/services/formatter";
import { promptLinter } from "@/services/linter";
import { promptLintStaged } from "@/services/lint-staged";
import { promptEnv } from "@/services/env";
import { promptTest } from "@/services/test";
import { promptEditorConfig } from "@/services/editor-config";
import { promptLicense } from "@/services/license";
import { config } from "@/config/config";
import { withCancelHandling } from "@/utils/handle-cancel";
import { TOOL_OPTIONS } from "@/constants/options";
import { Tool } from "@/config/types";
import { execution } from "@/steps/execution";
import packageJson from "../package.json";
import { logError } from "@/utils/logger";
import gitCheck from "./steps/git-check";
import { introScreen } from "./utils/display";

async function main() {
  try {
    introScreen();

    await gitCheck();

    const tools = (await withCancelHandling(async () =>
      multiselect({
        message: "Select tools to configure:",
        options: TOOL_OPTIONS,
        required: false,
      }),
    )) as string[] as Tool[];

    tools.forEach((tool) => config.enableTool(tool));

    if (config.get("husky").selected) await promptHusky(config);
    if (config.get("formatter").selected) await promptFormatter(config);
    if (config.get("linter").selected) await promptLinter(config);
    if (config.get("lintStaged").selected) await promptLintStaged(config);
    if (config.get("env").selected) await promptEnv(config);
    if (config.get("test").selected) await promptTest(config);
    if (config.get("editorConfig").selected) await promptEditorConfig(config);
    if (config.get("license").selected) await promptLicense(config);

    note(config.summary, "Configuration Summary");

    const proceed = (await withCancelHandling(async () =>
      confirm({
        message: "Do you want to proceed with the installation?",
      }),
    )) as boolean;

    if (!proceed) {
      outro(pc.yellow("Installation cancelled."));
      process.exit(0);
    }

    await execution(config);

    outro(pc.green("Setup complete!"));
  } catch (error) {
    const logPath = await logError(error);

    outro(pc.red(`\nSomething went wrong!\nError log saved to: ${logPath}`));

    process.exit(1);
  }
}

program
  .name("setup-project")
  .description("Interactive setup for common project tools")
  .version(packageJson.version)
  .action(main);

program.parse();
