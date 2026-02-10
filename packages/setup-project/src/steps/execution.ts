import { spinner } from "@clack/prompts";
import { Config } from "@/config/config";
import { installHusky } from "@/services/husky";
import { installFormatter } from "@/services/formatter";
import { installLinter } from "@/services/linter";
import { installLintStaged } from "@/services/lint-staged";
import { installEnv } from "@/services/env";
import { installTest } from "@/services/test";
import { installEditorConfig } from "@/services/editor-config";
import { installLicense } from "@/services/license";

export async function execution(config: Config) {
  const s = spinner();

  if (config.get("husky").selected) {
    s.start("Setting up Husky...");
    await installHusky(config);
    s.stop("Husky setup complete.");
  }

  if (config.get("formatter").selected) {
    const choice = config.get("formatter").config?.choice;
    s.start(`Setting up ${choice}...`);
    await installFormatter(config);
    s.stop(`${choice} setup complete.`);
  }

  if (config.get("linter").selected) {
    const choice = config.get("linter").config?.choice;
    s.start(`Setting up ${choice}...`);
    await installLinter(config);
    s.stop(`${choice} setup complete.`);
  }

  if (config.get("lintStaged").selected) {
    s.start("Setting up Lint-staged...");
    await installLintStaged(config);
    s.stop("Lint-staged setup complete.");
  }

  if (config.get("env").selected) {
    s.start("Setting up Env Validation...");
    await installEnv(config);
    s.stop("Env Validation setup complete.");
  }

  if (config.get("test").selected) {
    const runner = config.get("test").config?.runner;
    s.start(`Setting up ${runner}...`);
    await installTest(config);
    s.stop(`${runner} setup complete.`);
  }

  if (config.get("editorConfig").selected) {
    s.start("Creating .editorconfig...");
    await installEditorConfig(config);
    s.stop(".editorconfig created.");
  }

  if (config.get("license").selected) {
    s.start("Creating LICENSE...");
    await installLicense(config);
    s.stop("LICENSE created.");
  }
}
