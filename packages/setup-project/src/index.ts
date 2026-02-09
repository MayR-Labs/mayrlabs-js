#!/usr/bin/env node

import {
  outro,
  multiselect,
  isCancel,
  cancel,
  note,
  confirm,
  spinner,
} from "@clack/prompts";
import pc from "picocolors";
import { program } from "commander";
import { promptHusky, installHusky } from "@/services/husky";
import { promptFormatter, installFormatter } from "@/services/formatter";
import { promptLinter, installLinter } from "@/services/linter";
import { promptLintStaged, installLintStaged } from "@/services/lint-staged";
import { promptEnv, installEnv } from "@/services/env";
import { promptTest, installTest } from "@/services/test";
import {
  promptEditorConfig,
  installEditorConfig,
} from "@/services/editor-config";
import { promptLicense, installLicense } from "@/services/license";
import packageJson from "../package.json";
import { logError } from "@/utils/logger";
import gitCheck from "./steps/git-check";
import { introScreen } from "./utils/display";

async function main() {
  try {
    introScreen();

    await gitCheck();

    // 2. Survey Phase
    const tools = await multiselect({
      message: "Select tools to configure:",
      options: [
        { value: "husky", label: "Husky" },
        { value: "formatter", label: "Formatter (Prettier/Oxfmt)" },
        { value: "linter", label: "Linter (Eslint/Oxlint)" },
        { value: "lint-staged", label: "Lint-staged" },
        { value: "env", label: "Env Validation (@t3-oss/env)" },
        { value: "test", label: "Test Runner (Vitest/Jest)" },
        { value: "editorConfig", label: "EditorConfig" },
        { value: "license", label: "License" },
      ],
      required: false,
    });

    if (isCancel(tools)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    const selectedTools = tools as string[];
    const config: any = {
      husky: selectedTools.includes("husky"),
      formatter: selectedTools.includes("formatter"),
      linter: selectedTools.includes("linter"),
      lintStaged: selectedTools.includes("lint-staged"),
      env: selectedTools.includes("env"),
      test: selectedTools.includes("test"),
      editorConfig: selectedTools.includes("editorConfig"),
      license: selectedTools.includes("license"),
    };

    // Run Prompts
    if (config.husky) await promptHusky(config);
    if (config.formatter) await promptFormatter(config);
    if (config.linter) await promptLinter(config);
    if (config.lintStaged) await promptLintStaged(config);
    if (config.env) await promptEnv(config);
    if (config.test) await promptTest(config);
    if (config.editorConfig) await promptEditorConfig(config);
    if (config.license) await promptLicense(config);

    // 3. Summary & Confirmation
    let summary = "The following actions will be performed:\n\n";
    if (config.husky) summary += "- Install and configure Husky\n";
    if (config.formatter)
      summary += `- Install and configure ${config.formatterChoice}\n`;
    if (config.linter)
      summary += `- Install and configure ${config.linterChoice}\n`;
    if (config.lintStaged) summary += "- Install and configure Lint-staged\n";
    if (config.env) summary += "- Install and configure @t3-oss/env\n";
    if (config.test)
      summary += `- Install and configure ${config.testRunner}\n`;
    if (config.editorConfig) summary += "- Create .editorconfig\n";
    if (config.license) summary += `- Create LICENSE (${config.licenseType})\n`;

    note(summary, "Configuration Summary");

    const proceed = await confirm({
      message: "Do you want to proceed with the installation?",
    });

    if (!proceed || isCancel(proceed)) {
      cancel("Installation cancelled. Configuration saved.");
      process.exit(0);
    }

    // 5. Execution Phase
    const s = spinner();

    if (config.husky) {
      s.start("Setting up Husky...");
      await installHusky(config);
      s.stop("Husky setup complete.");
    }

    if (config.formatter) {
      s.start(`Setting up ${config.formatterChoice}...`);
      await installFormatter(config);
      s.stop(`${config.formatterChoice} setup complete.`);
    }

    if (config.linter) {
      s.start(`Setting up ${config.linterChoice}...`);
      await installLinter(config);
      s.stop(`${config.linterChoice} setup complete.`);
    }

    if (config.lintStaged) {
      s.start("Setting up Lint-staged...");
      await installLintStaged(config);
      s.stop("Lint-staged setup complete.");
    }

    if (config.env) {
      s.start("Setting up Env Validation...");
      await installEnv(config);
      s.stop("Env Validation setup complete.");
    }

    if (config.test) {
      s.start(`Setting up ${config.testRunner}...`);
      await installTest(config);
      s.stop(`${config.testRunner} setup complete.`);
    }

    if (config.editorConfig) {
      s.start("Creating .editorconfig...");
      await installEditorConfig(config);
      s.stop(".editorconfig created.");
    }

    if (config.license) {
      s.start("Creating LICENSE...");
      await installLicense(config);
      s.stop("LICENSE created.");
    }

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
