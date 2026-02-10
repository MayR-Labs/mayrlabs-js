import { describe, it, expect, vi, beforeEach } from "vitest";
import { configure } from "./commands/configure";
import { plugin } from "./commands/plugin";
import * as husky from "@/features/husky";
import * as formatter from "@/features/formatter";
import * as linter from "@/features/linter";
import * as prompts from "@clack/prompts";
import * as git from "@/steps/git-check";
import * as pluginInstaller from "@/steps/install-plugin";
import { config } from "@/core/config";

vi.mock("@/features/husky");
vi.mock("@/features/formatter");
vi.mock("@/features/linter");
vi.mock("@/features/lint-staged");
vi.mock("@/features/env");
vi.mock("@/features/test");
vi.mock("@/features/editor-config");
vi.mock("@/features/license");
vi.mock("@clack/prompts");
vi.mock("@/utils/pm");
vi.mock("@/steps/git-check");
vi.mock("@/steps/install-plugin");

describe("CLI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(prompts, "intro").mockImplementation(() => {});
    vi.spyOn(prompts, "outro").mockImplementation(() => {});
    vi.spyOn(git, "default").mockResolvedValue();
  });

  describe("configure", () => {
    it("should configure husky when selected", async () => {
      await configure("husky");
      expect(husky.promptHusky).toHaveBeenCalled();
      expect(husky.installHusky).toHaveBeenCalled();
      expect(config.get("husky").selected).toBe(true);
    });

    it("should configure formatter when selected", async () => {
      await configure("formatter");
      expect(formatter.promptFormatter).toHaveBeenCalled();
      expect(formatter.installFormatter).toHaveBeenCalled();
    });

    it("should prompt if no tool provided", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("linter");
      await configure();
      expect(linter.promptLinter).toHaveBeenCalled();
      expect(linter.installLinter).toHaveBeenCalled();
    });
  });

  describe("plugin", () => {
    it("should install plugins for provided tool", async () => {
      await plugin("eslint");
      expect(pluginInstaller.installPlugins).toHaveBeenCalledWith("eslint");
    });

    it("should prompt if no tool provided", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("prettier");
      await plugin();
      expect(pluginInstaller.installPlugins).toHaveBeenCalledWith("prettier");
    });
  });
});
