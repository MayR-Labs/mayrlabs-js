import { prompts } from "@/utils/prompts";
import { installPackages } from "@/utils/pm";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/core/config";
import { HUSKY_HOOK_OPTIONS, HuskyHookValue } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptHusky(config: Config) {
  prompts.log.message(pc.bgMagenta(pc.black(" Husky Configuration ")));

  const hookType = (await withCancelHandling(async () =>
    prompts.select({
      message: "What pre-commit hook would you like to use?",
      options: HUSKY_HOOK_OPTIONS,
    }),
  )) as HuskyHookValue;

  const huskyConfig = config.get("husky");

  huskyConfig.options = { hookType };

  if (hookType === "lintStaged") {
    config.enableTool("lintStaged");
  } else if (hookType === "custom") {
    const script = (await withCancelHandling(async () =>
      prompts.text({
        message: "Enter your custom pre-commit script:",
        placeholder: huskyConfig.options.customScript,
        validate(value) {
          if (value.length === 0) return "Value is required!";
        },
      }),
    )) as string;

    huskyConfig.options.customScript = script;
  }
}

export async function installHusky(config: Config) {
  await installPackages(["husky"], true);

  try {
    await execa("npx", ["husky", "init"]);
  } catch (e) {
    await execa("npm", ["pkg", "set", "scripts.prepare=husky"]);
    await execa("npm", ["run", "prepare"]);
  }

  const husky = config.get("husky");
  const hookType = husky.options.hookType;
  const customScript = husky.options.customScript;

  if (hookType === "lintStaged") {
    await fs.outputFile(".husky/pre-commit", "npx lint-staged\n", {
      mode: 0o755,
    });
  } else if (hookType === "custom" && customScript) {
    await fs.outputFile(".husky/pre-commit", `${customScript}\n`, {
      mode: 0o755,
    });
  }
}
