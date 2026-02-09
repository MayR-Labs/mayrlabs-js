import { multiselect, select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import { promptFormatter, installFormatter } from "@/services/formatter";
import { promptLinter, installLinter } from "@/services/linter";
import fs from "fs-extra";
import pc from "picocolors";

export async function promptLintStaged(config: any) {
  log.message(pc.bgGreen(pc.black(" Lint-staged Configuration ")));

  const lintExtensions = await multiselect({
    message: "Select extensions to lint:",
    options: [
      { value: "js", label: "js" },
      { value: "ts", label: "ts" },
      { value: "jsx", label: "jsx" },
      { value: "tsx", label: "tsx" },
      { value: "html", label: "html" },
      { value: "vue", label: "vue" },
      { value: "svelte", label: "svelte" },
    ],
    required: false,
  });

  const formatExtensions = await multiselect({
    message: "Select extensions to format:",
    options: [
      { value: "md", label: "md" },
      { value: "css", label: "css" },
      { value: "scss", label: "scss" },
      { value: "json", label: "json" },
      { value: "yaml", label: "yaml" },
      { value: "html", label: "html" },
      { value: "js", label: "js" },
      { value: "ts", label: "ts" },
      { value: "jsx", label: "jsx" },
      { value: "tsx", label: "tsx" },
      { value: "vue", label: "vue" },
      { value: "svelte", label: "svelte" },
    ],
    required: false,
  });

  config.lintStagedLintExtensions = lintExtensions;
  config.lintStagedFormatExtensions = formatExtensions;

  // Trigger prompt for dependencies if extensions are selected
  if ((lintExtensions as string[]).length > 0 && !config.linterChoice) {
    // Ask prompts immediately so config is captured
    await promptLinter(config);
    config.linter = true; // Ensure it gets installed
  }

  if ((formatExtensions as string[]).length > 0 && !config.formatterChoice) {
    await promptFormatter(config);
    config.formatter = true; // Ensure it gets installed
  }
}

export async function installLintStaged(config: any) {
  await installPackages(["lint-staged"], true);

  const lintStagedConfig: any = {};
  const lintExts = (config.lintStagedLintExtensions as string[]) || [];
  const formatExts = (config.lintStagedFormatExtensions as string[]) || [];

  // Ensure dependencies are installed (idempotent)
  if (lintExts.length > 0) {
    await installLinter(config);

    const glob = `*.{${lintExts.join(",")}}`;
    if (config.linterChoice === "oxlint") {
      // oxlint might not fix everything or support all exts, but generic logic here
      lintStagedConfig[glob] = ["npx oxlint --fix"];
    } else {
      lintStagedConfig[glob] = ["eslint --fix"];
    }
  }

  if (formatExts.length > 0) {
    await installFormatter(config);

    const glob = `*.{${formatExts.join(",")}}`;
    if (config.formatterChoice === "oxfmt") {
      // Filter exts supported by oxfmt if needed, or assume it handles them
      lintStagedConfig[glob] = ["npx oxfmt"];
    } else {
      lintStagedConfig[glob] = ["prettier --write"];
    }
  }

  await fs.writeJson(".lintstagedrc", lintStagedConfig, { spaces: 2 });
}
