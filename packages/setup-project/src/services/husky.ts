import { select, text } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import { execa } from "execa";
import fs from "fs-extra";

export async function setupHusky(config: any) {
  // Install husky
  await installPackages(["husky"], true);

  // Init husky
  // For Husky v9, 'husky init' is the recommended way.
  try {
    await execa("npx", ["husky", "init"]);
  } catch (e) {
    // Fallback: manual setup
    await execa("npm", ["pkg", "set", "scripts.prepare=husky"]);
    await execa("npm", ["run", "prepare"]);
  }

  const hookType = await select({
    message: "What pre-commit hook would you like to use?",
    options: [
      { value: "lint-staged", label: "lint-staged" },
      { value: "custom", label: "Custom script" },
      { value: "none", label: "None" },
    ],
  });

  if (hookType === "lint-staged") {
    config.lintStaged = true;
    await fs.outputFile(".husky/pre-commit", "npx lint-staged\n", {
      mode: 0o755,
    });
  } else if (hookType === "custom") {
    const script = await text({
      message: "Enter your custom pre-commit script:",
      placeholder: "npm test",
      validate(value: string) {
        if (value.length === 0) return "Value is required!";
      },
    });

    if (typeof script === "string") {
      await fs.outputFile(".husky/pre-commit", `${script}\n`, { mode: 0o755 });
    }
  }
}
