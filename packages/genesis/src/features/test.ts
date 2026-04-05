import fs from "fs-extra";
import pc from "picocolors";
import { TEST_RUNNER_OPTIONS, type TestRunnerValue } from "@/constants/options";
import type { Config } from "@/core/config";
import { withCancelHandling } from "@/utils/handle-cancel";
import { installPackages } from "@/utils/pm";
import { prompts } from "@/utils/prompts";

export async function promptTest(config: Config) {
  prompts.log.message(pc.bgYellow(pc.red(" Test Runner Configuration ")));

  const runner = (await withCancelHandling(async () =>
    prompts.select({
      message: "Select a test runner:",
      options: TEST_RUNNER_OPTIONS,
    }),
  )) as TestRunnerValue;

  config.get("test").options = { runner };
}

export async function installTest(config: Config) {
  const runner = config.get("test").options.runner;

  if (runner === "vitest") {
    await installPackages(["vitest"], true);
    const configFile = "vitest.config.ts";
    if (!(await fs.pathExists(configFile))) {
      await fs.outputFile(
        configFile,
        `import { defineConfig } from 'vitest/config';\n\nexport default defineConfig({\n  test: {\n    environment: 'node',\n  },\n});\n`,
      );
    }
  } else if (runner === "jest") {
    await installPackages(["jest", "ts-jest", "@types/jest"], true);
    const configFile = "jest.config.js";
    if (!(await fs.pathExists(configFile))) {
      await fs.outputFile(
        configFile,
        `/** @type {import('ts-jest').JestConfigWithTsJest} */\nmodule.exports = {\n  preset: 'ts-jest',\n  testEnvironment: 'node',\n};\n`,
      );
    }
  }
}
