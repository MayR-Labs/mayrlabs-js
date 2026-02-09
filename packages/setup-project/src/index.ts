#!/usr/bin/env node

import { intro, outro, multiselect, isCancel, cancel } from "@clack/prompts";
import pc from "picocolors";
import { program } from "commander";
import { setupFormatter } from "@/services/formatter";
import { setupHusky } from "@/services/husky";
import { setupLinter } from "@/services/linter";
import { setupLintStaged } from "@/services/lint-staged";
import { setupEnv } from "@/services/env";
import packageJson from "../package.json" with { type: "json" };

async function main() {
  intro(pc.bgCyan(pc.black(" @mayrlabs/setup-project ")));

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
  // Using explicit any to allow dynamic property addition
  const config: any = {
    husky: selectedTools.includes("husky"),
    formatter: selectedTools.includes("formatter"),
    linter: selectedTools.includes("linter"),
    lintStaged: selectedTools.includes("lint-staged"),
    env: selectedTools.includes("env"),
  };

  if (config.husky) {
    await setupHusky(config);
  }

  if (config.formatter) {
    await setupFormatter(config);
  }

  if (config.linter) {
    await setupLinter(config);
  }

  // specific check because husky might have enabled it
  if (config.lintStaged) {
    await setupLintStaged(config);
  }

  if (config.env) {
    await setupEnv(config);
  }

  outro(pc.green("Setup complete!"));
}

program
  .name("setup-project")
  .description("Interactive setup for common project tools")
  .version(packageJson.version)
  .action(main);

program.parse();
