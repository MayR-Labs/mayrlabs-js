import { select } from "@clack/prompts";
import { installPackages } from "../utils/pm.js";
import fs from "fs-extra";

export async function setupFormatter(config: any, preSelected?: string) {
  let formatter = preSelected;

  if (!formatter) {
    formatter = (await select({
      message: "Select a formatter:",
      options: [
        { value: "prettier", label: "Prettier" },
        { value: "oxfmt", label: "Oxfmt" },
      ],
    })) as string;
  }

  // Save choice to config for other tools to use
  config.formatterChoice = formatter;

  if (formatter === "prettier") {
    await installPackages(["prettier"], true);
    const configContent = {
      semi: true,
      singleQuote: true,
      trailingComma: "all",
      printWidth: 80,
      tabWidth: 2,
    };
    await fs.writeJson(".prettierrc", configContent, { spaces: 2 });
  } else if (formatter === "oxfmt") {
    // oxfmt setup
    await installPackages(["oxfmt"], true);
    // oxfmt is mostly zero-config but we can create a basic one if needed
    // or just rely on defaults.
    // It supports .oxfmtrc.json
  }
}
