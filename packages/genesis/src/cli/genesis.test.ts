import { describe, it, expect, vi, beforeEach } from "vitest";
import * as husky from "@/features/husky";
import * as formatter from "@/features/formatter";
import * as linter from "@/features/linter";
import { prompts } from "@/utils/prompts";
import { config } from "@/core/config";
import { configure } from "./commands/configure";

vi.mock("@/features/husky");
vi.mock("@/features/formatter");
vi.mock("@/features/linter");
vi.mock("@/features/lint-staged");
vi.mock("@/features/env");
vi.mock("@/features/test");
vi.mock("@/features/editor-config");
vi.mock("@/features/license");
vi.mock("@/utils/prompts", () => ({
  prompts: {
    intro: vi.fn(),
    outro: vi.fn(),
    text: vi.fn(),
    select: vi.fn(),
    confirm: vi.fn(),
    multiselect: vi.fn(),
    isCancel: vi.fn((val) => val === Symbol("cancel")),
    log: {
      message: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  },
}));
vi.mock("@/utils/pm");
vi.mock("@/steps/git-check");
vi.mock("@/steps/install-plugin");

describe("CLI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.clear(); // Ensure config is reset if it has state
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
      vi.mocked(prompts.select).mockResolvedValue("linter" as any);
      await configure();
      expect(linter.promptLinter).toHaveBeenCalled();
      expect(linter.installLinter).toHaveBeenCalled();
    });
  });
});
