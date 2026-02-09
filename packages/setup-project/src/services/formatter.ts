import { select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import pc from "picocolors";

export async function promptFormatter(config: any) {
  if (!config.formatterChoice) {
    log.message(pc.bgBlue(pc.black(" Formatter Configuration ")));
    const formatter = (await select({
      message: "Select a formatter:",
      options: [
        { value: "prettier", label: "Prettier" },
        { value: "oxfmt", label: "Oxfmt" },
      ],
    })) as string;
    config.formatterChoice = formatter;
  }
}

export async function installFormatter(config: any) {
  if (config.formatterChoice === "prettier") {
    await installPackages(["prettier"], true);
    const configContent = {
      semi: true,
      singleQuote: true,
      trailingComma: "all",
      printWidth: 80,
      tabWidth: 2,
    };
    await fs.writeJson(".prettierrc", configContent, { spaces: 2 });
  } else if (config.formatterChoice === "oxfmt") {
    await installPackages(["oxfmt"], true);
  }
}
