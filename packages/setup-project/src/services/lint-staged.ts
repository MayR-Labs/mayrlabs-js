import { multiselect, select } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import { setupFormatter } from "@/services/formatter";
import { setupLinter } from "@/services/linter";
import fs from "fs-extra";

export async function setupLintStaged(config: any) {
  await installPackages(["lint-staged"], true);

  const lintExtensions = await multiselect({
    message: "Select extensions to lint:",
    options: [
      { value: "js", label: "js" },
      { value: "ts", label: "ts" },
      { value: "jsx", label: "jsx" },
      { value: "tsx", label: "tsx" },
    ],
    required: false,
  });

  const formatExtensions = await multiselect({
    message: "Select extensions to format:",
    options: [
      { value: "md", label: "md" },
      { value: "css", label: "css" },
      { value: "json", label: "json" },
    ],
    required: false,
  });

  const lintStagedConfig: any = {};

  // Handle Linting
  const lintExts = lintExtensions as string[];
  if (lintExts.length > 0) {
    if (!config.linterChoice) {
      const linterChoice = (await select({
        message: "No linter selected. Which one should lint-staged use?",
        options: [
          { value: "eslint", label: "ESLint" },
          { value: "oxlint", label: "Oxlint" },
        ],
      })) as string;

      await setupLinter(config, linterChoice);
    }

    const glob = `*.{${lintExts.join(",")}}`;
    if (config.linterChoice === "oxlint") {
      lintStagedConfig[glob] = ["npx oxlint --fix"];
    } else {
      lintStagedConfig[glob] = ["eslint --fix"];
    }
  }

  // Handle Formatting
  const formatExts = formatExtensions as string[];
  if (formatExts.length > 0) {
    if (!config.formatterChoice) {
      const formatterChoice = (await select({
        message: "No formatter selected. Which one should lint-staged use?",
        options: [
          { value: "prettier", label: "Prettier" },
          { value: "oxfmt", label: "Oxfmt" },
        ],
      })) as string;

      await setupFormatter(config, formatterChoice);
    }

    const glob = `*.{${formatExts.join(",")}}`;
    if (config.formatterChoice === "oxfmt") {
      lintStagedConfig[glob] = ["npx oxfmt"];
    } else {
      lintStagedConfig[glob] = ["prettier --write"];
    }
  }

  await fs.writeJson(".lintstagedrc", lintStagedConfig, { spaces: 2 });
}
