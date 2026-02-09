import { select } from "@clack/prompts";
import { installPackages } from "../utils/pm.js";
import fs from "fs-extra";

export async function setupLinter(config: any, preSelected?: string) {
  let linter = preSelected;

  if (!linter) {
    linter = (await select({
      message: "Select a linter:",
      options: [
        { value: "eslint", label: "ESLint" },
        { value: "oxlint", label: "Oxlint" },
      ],
    })) as string;
  }

  config.linterChoice = linter;

  if (linter === "eslint") {
    await installPackages(["eslint"], true);
    const configContent = {
      extends: ["eslint:recommended"],
      env: {
        node: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    };
    await fs.writeJson(".eslintrc.json", configContent, { spaces: 2 });
  } else if (linter === "oxlint") {
    await installPackages(["oxlint"], true);
    // oxlint usually runs without config or minimal config
    // It can use .oxlintrc.json
  }
}
