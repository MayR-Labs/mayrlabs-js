import { prompts } from "@/utils/prompts";
import { installPackages } from "@/utils/pm";
import { promptFormatter, installFormatter } from "@/features/formatter";
import { promptLinter, installLinter } from "@/features/linter";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/core/config";
import {
  LINT_STAGED_EXTENSIONS,
  LintStagedExtensionValue,
} from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptLintStaged(config: Config) {
  prompts.log.message(pc.bgGreen(pc.black(" Lint-staged Configuration ")));

  const lintExtensions = (await withCancelHandling(async () =>
    prompts.multiselect({
      message: "Select extensions to lint:",
      options: LINT_STAGED_EXTENSIONS,
      required: false,
    }),
  )) as LintStagedExtensionValue[];

  const formatExtensions = (await withCancelHandling(async () =>
    prompts.multiselect({
      message: "Select extensions to format:",
      options: LINT_STAGED_EXTENSIONS,
      required: false,
    }),
  )) as LintStagedExtensionValue[];

  config.get("lintStaged").options = {
    lintExtensions,
    formatExtensions,
  };

  if (lintExtensions.length > 0 && !config.get("linter").selected) {
    await promptLinter(config);
    config.enableTool("linter");
  }

  if (formatExtensions.length > 0 && !config.get("formatter").selected) {
    await promptFormatter(config);
    config.enableTool("formatter");
  }
}

import { resolveConfigFile, writeConfig } from "@/utils/config-file";

export async function installLintStaged(config: Config) {
  await installPackages(["lint-staged"], true);

  const configFile = await resolveConfigFile("Lint-Staged", [
    ".lintstagedrc",
    ".lintstagedrc.json",
    "lint-staged.config.js",
    ".lintstagedrc.js",
    ".lintstagedrc.mjs",
  ]);

  const lintStagedConfig: any = {};
  const lintStagedOptions = config.get("lintStaged").options;
  const lintExts = lintStagedOptions?.lintExtensions || [];
  const formatExts = lintStagedOptions?.formatExtensions || [];

  if (lintExts.length > 0) {
    await installLinter(config);

    const glob = `*.{${lintExts.join(",")}}`;
    if (config.get("linter").options.choice === "oxlint") {
      lintStagedConfig[glob] = ["npx oxlint --fix"];
    } else {
      lintStagedConfig[glob] = ["eslint --fix"];
    }
  }

  if (formatExts.length > 0) {
    await installFormatter(config);

    const glob = `*.{${formatExts.join(",")}}`;
    if (config.get("formatter").options.choice === "oxfmt") {
      lintStagedConfig[glob] = ["npx oxfmt"];
    } else {
      lintStagedConfig[glob] = ["prettier --write"];
    }
  }

  await writeConfig(configFile, lintStagedConfig);
}
