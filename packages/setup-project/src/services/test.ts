import { select, log } from "@clack/prompts";
import { installPackages } from "@/utils/pm";
import fs from "fs-extra";
import pc from "picocolors";

export async function promptTest(config: any) {
  log.message(pc.bgRed(pc.black(" Test Runner Configuration ")));

  const runner = (await select({
    message: "Select a test runner:",
    options: [
      { value: "vitest", label: "Vitest" },
      { value: "jest", label: "Jest" },
    ],
  })) as string;
  config.testRunner = runner;
}

export async function installTest(config: any) {
  if (config.testRunner === "vitest") {
    await installPackages(["vitest"], true);
    const configFile = "vitest.config.ts";
    if (!(await fs.pathExists(configFile))) {
      await fs.outputFile(
        configFile,
        `import { defineConfig } from 'vitest/config';\n\nexport default defineConfig({\n  test: {\n    environment: 'node',\n  },\n});\n`,
      );
    }
  } else if (config.testRunner === "jest") {
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
