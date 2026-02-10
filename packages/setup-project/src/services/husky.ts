import { select, log, text } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/config/config";
import { HUSKY_HOOK_OPTIONS, HuskyHookValue } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptHusky(config: Config) {
  log.message(pc.bgMagenta(pc.black(" Husky Configuration ")));

  const hookType = (await withCancelHandling(async () =>
    select({
      message: "What pre-commit hook would you like to use?",
      options: HUSKY_HOOK_OPTIONS,
    }),
  )) as HuskyHookValue;

  const husky = config.get("husky");
  husky.config = { hookType };

  if (hookType === "lint-staged") {
    config.enableTool("lintStaged");
  } else if (hookType === "custom") {
    const script = (await withCancelHandling(async () =>
      text({
        message: "Enter your custom pre-commit script:",
        placeholder: "npm test",
        validate(value) {
          if (value.length === 0) return "Value is required!";
        },
      }),
    )) as string;

    husky.config.customScript = script;
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
  const hookType = husky.config?.hookType;
  const customScript = husky.config?.customScript;

  if (hookType === "lint-staged") {
    await fs.outputFile(".husky/pre-commit", "npx lint-staged\n", {
      mode: 0o755,
    });
  } else if (hookType === "custom" && customScript) {
    await fs.outputFile(".husky/pre-commit", `${customScript}\n`, {
      mode: 0o755,
    });
  }
}
