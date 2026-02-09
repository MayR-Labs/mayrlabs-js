#!/usr/bin/env node

import {
  intro,
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
import { isGitDirty, commitChanges, isGitRepository } from "@/utils/git";
import packageJson from "../package.json";

async function main() {
  intro(pc.bgCyan(pc.black(" @mayrlabs/setup-project ")));

  // 1. Git Check
  if (await isGitRepository()) {
    if (await isGitDirty()) {
      const shouldCommit = await confirm({
        message:
          "Your working directory is dirty. Would you like to commit changes before proceeding?",
      });

      if (shouldCommit) {
        const message = await import("@clack/prompts").then((m) =>
          m.text({
            message: "Enter commit message:",
            placeholder: "wip: pre-setup commit",
            validate(value) {
              if (value.length === 0) return "Commit message is required";
            },
          }),
        );

        if (typeof message === "string") {
          const s = spinner();
          s.start("Committing changes...");
          await commitChanges(message);
          s.stop("Changes committed.");
        }
      }
    }
  }

  // 2. Survey Phase
  const tools = await multiselect({
    message: "Select tools to configure:",
    options: [
      { value: "husky", label: "Husky" },
      { value: "formatter", label: "Formatter (Prettier/Oxfmt)" },
      { value: "linter", label: "Linter (Eslint/Oxlint)" },
      { value: "lint-staged", label: "Lint-staged" },
      { value: "env", label: "Env Validation (@t3-oss/env)" },
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
  };

  // Run Prompts
  if (config.husky) await promptHusky(config);
  if (config.formatter) await promptFormatter(config);
  if (config.linter) await promptLinter(config);
  if (config.lintStaged) await promptLintStaged(config);
  if (config.env) await promptEnv(config);

  // 3. Summary & Confirmation
  let summary = "The following actions will be performed:\n\n";
  if (config.husky) summary += "- Install and configure Husky\n";
  if (config.formatter)
    summary += `- Install and configure ${config.formatterChoice}\n`;
  if (config.linter)
    summary += `- Install and configure ${config.linterChoice}\n`;
  if (config.lintStaged) summary += "- Install and configure Lint-staged\n";
  if (config.env) summary += "- Install and configure @t3-oss/env\n";

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

  // specific check because husky might have enabled it
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

  outro(pc.green("Setup complete!"));
}

program
  .name("setup-project")
  .description("Interactive setup for common project tools")
  .version(packageJson.version)
  .action(main);

program.parse();
