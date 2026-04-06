import pc from "picocolors";
import { FORMATTER_OPTIONS, type FormatterValue } from "@/constants/options";
import type { Config } from "@/core/config";
import { withCancelHandling } from "@/utils/handle-cancel";
import { prompts } from "@/utils/prompts";
import { installOxfmt } from "./formatter/oxfmt";
import { installPrettier } from "./formatter/prettier";

export async function promptFormatter(config: Config) {
  const formatterConfig = config.get("formatter");

  prompts.log.message(pc.bgBlue(pc.white(" Formatter Configuration ")));

  const formatter = (await withCancelHandling(async () =>
    prompts.select({
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

  prompts.log.message(pc.white(pc.bgBlack(` Installing ${formatter}... `)));

  if (formatter === "prettier") await installPrettier();
  else if (formatter === "oxfmt") await installOxfmt();
}
