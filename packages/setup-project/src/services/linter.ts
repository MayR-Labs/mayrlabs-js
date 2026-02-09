import { select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import pc from "picocolors";

export async function promptLinter(config: any) {
  if (!config.linterChoice) {
    log.message(pc.bgYellow(pc.black(" Linter Configuration ")));
    const linter = (await select({
      message: "Select a linter:",
      options: [
        { value: "eslint", label: "ESLint" },
        { value: "oxlint", label: "Oxlint" },
      ],
    })) as string;
    config.linterChoice = linter;
  }
}

export async function installLinter(config: any) {
  if (config.linterChoice === "eslint") {
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
  } else if (config.linterChoice === "oxlint") {
    await installPackages(["oxlint"], true);
  }
}
