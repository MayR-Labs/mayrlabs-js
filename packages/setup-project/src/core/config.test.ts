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

  it("should prompt summary correctly", () => {
    config.enableTool("husky");
    const summary = config.summary;
    expect(summary).toContain("Install and configure Husky");
    expect(summary).not.toContain("Formatter");
  });
});
