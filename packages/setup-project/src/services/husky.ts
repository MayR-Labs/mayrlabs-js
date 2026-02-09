import { log, select, text } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

export async function promptHusky(config: any) {
  log.message(pc.bgMagenta(pc.black(" Husky Configuration ")));

  const hookType = (await select({
    message: "What pre-commit hook would you like to use?",
    options: [
      { value: "lint-staged", label: "lint-staged" },
      { value: "custom", label: "Custom script" },
      { value: "none", label: "None" },
    ],
  })) as string;

  config.huskyHookType = hookType;

  if (hookType === "lint-staged") {
    config.lintStaged = true;
  } else if (hookType === "custom") {
    const script = await text({
      message: "Enter your custom pre-commit script:",
      placeholder: "npm test",
      validate(value: string) {
        if (value.length === 0) return "Value is required!";
      },
    });

    config.huskyCustomScript = script;
  }
}

export async function installHusky(config: any) {
  // Install husky
  await installPackages(["husky"], true);

  // Init husky
  try {
    await execa("npx", ["husky", "init"]);
  } catch (e) {
    await execa("npm", ["pkg", "set", "scripts.prepare=husky"]);
    await execa("npm", ["run", "prepare"]);
  }

  if (config.huskyHookType === "lint-staged") {
    await fs.outputFile(".husky/pre-commit", "npx lint-staged\n", {
      mode: 0o755,
    });
  } else if (config.huskyHookType === "custom" && config.huskyCustomScript) {
    await fs.outputFile(".husky/pre-commit", `${config.huskyCustomScript}\n`, {
      mode: 0o755,
    });
  }
}
