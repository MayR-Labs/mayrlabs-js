import { multiselect, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import { promptFormatter, installFormatter } from "@/services/formatter";
import { promptLinter, installLinter } from "@/services/linter";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/config/config";
import {
  LINT_STAGED_EXTENSIONS,
  LintStagedExtensionValue,
} from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptLintStaged(config: Config) {
  log.message(pc.bgGreen(pc.black(" Lint-staged Configuration ")));

  const lintExtensions = (await withCancelHandling(async () =>
    multiselect({
      message: "Select extensions to lint:",
      options: LINT_STAGED_EXTENSIONS,
      required: false,
    }),
  )) as LintStagedExtensionValue[];

  const formatExtensions = (await withCancelHandling(async () =>
    multiselect({
      message: "Select extensions to format:",
      options: LINT_STAGED_EXTENSIONS,
      required: false,
    }),
  )) as LintStagedExtensionValue[];

  config.get("lintStaged").config = {
    lintExtensions,
    formatExtensions,
  };

  // Trigger prompt for dependencies if extensions are selected
  if (lintExtensions.length > 0 && !config.get("linter").selected) {
    // Ask prompts immediately so config is captured
    await promptLinter(config);
    config.enableTool("linter"); // Ensure it gets installed
  }

  if (formatExtensions.length > 0 && !config.get("formatter").selected) {
    await promptFormatter(config);
    config.enableTool("formatter"); // Ensure it gets installed
  }
}

export async function installLintStaged(config: Config) {
  await installPackages(["lint-staged"], true);

  const lintStagedConfig: any = {};
  const lintStagedOptions = config.get("lintStaged").config;
  const lintExts = lintStagedOptions?.lintExtensions || [];
  const formatExts = lintStagedOptions?.formatExtensions || [];

  // Ensure dependencies are installed (idempotent)
  if (lintExts.length > 0) {
    await installLinter(config);

    const glob = `*.{${lintExts.join(",")}}`;
    if (config.get("linter").config?.choice === "oxlint") {
      // oxlint might not fix everything or support all exts, but generic logic here
      lintStagedConfig[glob] = ["npx oxlint --fix"];
    } else {
      lintStagedConfig[glob] = ["eslint --fix"];
    }
  }

  if (formatExts.length > 0) {
    await installFormatter(config);

    const glob = `*.{${formatExts.join(",")}}`;
    if (config.get("formatter").config?.choice === "oxfmt") {
      // Filter exts supported by oxfmt if needed, or assume it handles them
      lintStagedConfig[glob] = ["npx oxfmt"];
    } else {
      lintStagedConfig[glob] = ["prettier --write"];
    }
  }

  await fs.writeJson(".lintstagedrc", lintStagedConfig, { spaces: 2 });
}
