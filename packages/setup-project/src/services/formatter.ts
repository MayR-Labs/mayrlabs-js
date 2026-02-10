import { select, log } from "@clack/prompts";
import pc from "picocolors";
import { Config } from "@/config/config";
import { FORMATTER_OPTIONS, FormatterValue } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";
import { installPrettier } from "./formatter/prettier";
import { installOxfmt } from "./formatter/oxfmt";

export async function promptFormatter(config: Config) {
  const formatterConfig = config.get("formatter");

  log.message(pc.bgBlue(pc.white(" Formatter Configuration ")));

  const formatter = (await withCancelHandling(async () =>
    select({
      message: "Select a formatter:",
      options: FORMATTER_OPTIONS,
      initialValue: formatterConfig.options.choice,
    }),
  )) as FormatterValue;

  formatterConfig.options = { choice: formatter };
}

export async function installFormatter(config: Config) {
  const formatter = config.get("formatter").options.choice;

  if (!formatter) return;

  log.message(pc.white(pc.bgBlack(` Installing ${formatter}... `)));

  if (formatter === "prettier") await installPrettier();
  else if (formatter === "oxfmt") await installOxfmt();
}
