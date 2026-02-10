import { select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/config/config";
import { FORMATTER_OPTIONS } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptFormatter(config: Config) {
  const formatterConfig = config.get("formatter");

  if (!formatterConfig.config?.choice) {
    log.message(pc.bgBlue(pc.black(" Formatter Configuration ")));

    const formatter = (await withCancelHandling(async () =>
      select({
        message: "Select a formatter:",
        options: FORMATTER_OPTIONS,
      }),
    )) as string as "prettier" | "oxfmt";

    formatterConfig.config = { choice: formatter };
  }
}

export async function installFormatter(config: Config) {
  const choice = config.get("formatter").config?.choice;
  if (choice === "prettier") {
    await installPackages(["prettier"], true);
    const configContent = {
      semi: true,
      singleQuote: true,
      trailingComma: "all",
      printWidth: 80,
      tabWidth: 2,
    };
    await fs.writeJson(".prettierrc", configContent, { spaces: 2 });
  } else if (choice === "oxfmt") {
    await installPackages(["oxfmt"], true);
  }
}
