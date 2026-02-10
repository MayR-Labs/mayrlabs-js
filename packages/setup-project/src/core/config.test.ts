import { describe, it, expect, beforeEach } from "vitest";
import { Config } from "./config";

describe("Config", () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
  });

  it("should initialize with default values", () => {
    expect(config.data.husky.selected).toBe(false);
    expect(config.data.formatter.selected).toBe(false);
    expect(config.data.linter.selected).toBe(false);
  });

  it("should enable a tool", () => {
    config.enableTool("husky");
    expect(config.data.husky.selected).toBe(true);
  });

  it("should retrieve tool config", () => {
    const huskyConfig = config.get("husky");
    expect(huskyConfig).toBeDefined();
    expect(huskyConfig.selected).toBe(false);
  });

  it("should generate summary for all tools", () => {
    config.enableTool("husky");
    config.get("husky").options = {
      hookType: "custom",
      customScript: "echo 'husky'",
    };

    config.enableTool("formatter");
    config.get("formatter").options = { choice: "prettier" };

    config.enableTool("linter");
    config.get("linter").options = { choice: "eslint" };

    config.enableTool("lintStaged");
    config.get("lintStaged").options = {
      lintExtensions: ["ts"],
      formatExtensions: ["json"],
    };

    config.enableTool("env");
    config.get("env").options = {
      variant: "@t3-oss/env-nextjs",
      validator: "zod",
      installPresets: false,
      presets: [],
      split: "split",
      location: "src/lib",
    };

    config.enableTool("test");
    config.get("test").options = { runner: "vitest" };

    config.enableTool("editorConfig");
    config.get("editorConfig").options = { preset: "default" };

    config.enableTool("license");
    config.get("license").options = {
      type: "MIT",
      name: "Author",
      email: "test@example.com",
      website: "https://example.com",
    };

    const summary = config.summary;

    expect(summary).toContain("Install and configure Husky");
    expect(summary).toContain("Custom hook script");
    expect(summary).toContain("Install and configure prettier");
    expect(summary).toContain("Install and configure eslint");
    expect(summary).toContain("Install and configure Lint-staged");
    expect(summary).toContain("Lint: ts");
    expect(summary).toContain("Format: json");
    expect(summary).toContain("Install and configure Env Validation");
    expect(summary).toContain("Install and configure Test Runner (vitest)");
    expect(summary).toContain("Create .editorconfig (default)");
    expect(summary).toContain("Create LICENSE (MIT)");
    expect(summary).toContain("Holder: Author");
  });
});
