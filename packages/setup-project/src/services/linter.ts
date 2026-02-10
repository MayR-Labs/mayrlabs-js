import { select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/config/config";
import { LINTER_OPTIONS } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptLinter(config: Config) {
  const linterConfig = config.get("linter");
  if (!linterConfig.config?.choice) {
    log.message(pc.bgYellow(pc.black(" Linter Configuration ")));
    const linter = (await withCancelHandling(async () =>
      select({
        message: "Select a linter:",
        options: LINTER_OPTIONS,
      }),
    )) as string as "eslint" | "oxlint";

    linterConfig.config = { choice: linter };
  }
}

export async function installLinter(config: Config) {
  const choice = config.get("linter").config?.choice;
  if (choice === "eslint") {
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
  } else if (choice === "oxlint") {
    await installPackages(["oxlint"], true);
  }
}
