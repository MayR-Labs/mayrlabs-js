import { prompts } from "@/utils/prompts";
import pc from "picocolors";
import { Config } from "@/core/config";
import { LINTER_OPTIONS, LinterValue } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";
import { installEslint } from "./linter/eslint";
import { installOxlint } from "./linter/oxlint";

export async function promptLinter(config: Config) {
  const linterConfig = config.get("linter");

  prompts.log.message(pc.bgYellow(pc.black(" Linter Configuration ")));
  const linter = (await withCancelHandling(async () =>
    prompts.select({
      message: "Select a linter:",
      options: LINTER_OPTIONS,
      initialValue: linterConfig.options.choice,
    })
  )) as LinterValue;

  linterConfig.options = { choice: linter };
}

export async function installLinter(config: Config) {
  const linter = config.get("linter").options.choice;
  if (!linter) return;

  prompts.log.message(pc.white(pc.bgBlack(` Installing ${linter}... `)));

  if (linter === "eslint") await installEslint();
  else if (linter === "oxlint") await installOxlint();
}
