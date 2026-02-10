import { select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import pc from "picocolors";
import { Config } from "@/config/config";
import { TEST_RUNNER_OPTIONS } from "@/constants/options";
import { withCancelHandling } from "@/utils/handle-cancel";

export async function promptTest(config: Config) {
  log.message(pc.bgRed(pc.black(" Test Runner Configuration ")));

  const runner = (await withCancelHandling(async () =>
    select({
      message: "Select a test runner:",
      options: TEST_RUNNER_OPTIONS,
    }),
  )) as string as "vitest" | "jest";

  config.get("test").config = { runner };
}

export async function installTest(config: Config) {
  const runner = config.get("test").config?.runner;

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
