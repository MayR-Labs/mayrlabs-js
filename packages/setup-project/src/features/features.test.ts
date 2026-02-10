import { describe, it, expect, vi, beforeEach } from "vitest";
import { promptHusky, installHusky } from "./husky";
import { promptFormatter, installFormatter } from "./formatter";
import { promptLinter, installLinter } from "./linter";
import { promptLintStaged, installLintStaged } from "./lint-staged";
import { promptEnv, installEnv } from "./env";
import { promptTest, installTest } from "./test";
import { promptEditorConfig, installEditorConfig } from "./editor-config";
import { promptLicense, installLicense } from "./license";
import { Config } from "@/core/config";
import * as pm from "@/utils/pm";
import * as prompts from "@clack/prompts";
import fs from "fs-extra";

vi.mock("@/utils/pm");
vi.mock("@clack/prompts");
vi.mock("fs-extra");
vi.mock("execa");

describe("Features", () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
    vi.clearAllMocks();
    // Default mock implementation for prompts to avoid hanging
    vi.spyOn(prompts, "select").mockResolvedValue("some-value" as any);
    vi.spyOn(prompts, "text").mockResolvedValue("some-text" as any);
    vi.spyOn(prompts, "confirm").mockResolvedValue(true as any);
    vi.spyOn(prompts, "multiselect").mockResolvedValue([] as any);
    vi.spyOn(prompts, "log", "get").mockReturnValue({
      message: vi.fn(),
      step: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
    } as any);
  });

  describe("Husky", () => {
    it("should prompt for husky options", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("custom");
      vi.spyOn(prompts, "text").mockResolvedValue("echo test");

      await promptHusky(config);

      expect(config.get("husky").options.hookType).toBe("custom");
      expect(config.get("husky").options.customScript).toBe("echo test");
    });

    it("should install husky", async () => {
      config.get("husky").options.hookType = "custom";
      config.get("husky").options.customScript = "echo test";

      await installHusky(config);

      expect(pm.installPackages).toHaveBeenCalledWith(["husky"], true);
    });
  });

  describe("Formatter", () => {
    it("should prompt for formatter", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("prettier");
      await promptFormatter(config);
      expect(config.get("formatter").options.choice).toBe("prettier");
    });

    it("should install prettier", async () => {
      config.get("formatter").options.choice = "prettier";
      vi.spyOn(prompts, "confirm").mockResolvedValue(false); // Don't install plugins

      await installFormatter(config);

      expect(pm.installPackages).toHaveBeenCalledWith(["prettier"], true);
    });
  });

  describe("Linter", () => {
    it("should prompt for linter", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("eslint");
      await promptLinter(config);
      expect(config.get("linter").options.choice).toBe("eslint");
    });

    it("should install eslint", async () => {
      config.get("linter").options.choice = "eslint";
      vi.spyOn(prompts, "confirm").mockResolvedValue(false);

      await installLinter(config);

      expect(pm.installPackages).toHaveBeenCalledWith(
        expect.arrayContaining(["eslint"]),
        true,
      );
    });
  });

  describe("Lint Staged", () => {
    it("should prompt for lint-staged", async () => {
      vi.spyOn(prompts, "multiselect").mockResolvedValue(["ts"]);

      await promptLintStaged(config);

      expect(config.get("lintStaged").options.lintExtensions).toEqual(["ts"]);
      expect(config.get("lintStaged").options.formatExtensions).toEqual(["ts"]);
      expect(config.get("linter").selected).toBe(true);
      expect(config.get("formatter").selected).toBe(true);
    });

    it("should install lint-staged", async () => {
      config.get("lintStaged").options.lintExtensions = ["ts"];
      config.get("lintStaged").options.formatExtensions = ["ts"];
      config.get("linter").options.choice = "eslint";
      config.get("formatter").options.choice = "prettier";

      await installLintStaged(config);

      expect(pm.installPackages).toHaveBeenCalledWith(["lint-staged"], true);
    });
  });

  describe("Env", () => {
    it("should prompt for env", async () => {
      vi.spyOn(prompts, "select")
        .mockResolvedValueOnce("@t3-oss/env-nextjs" as any)
        .mockResolvedValueOnce("zod" as any)
        .mockResolvedValueOnce("split" as any);
      vi.spyOn(prompts, "confirm").mockResolvedValue(false);
      vi.spyOn(prompts, "text").mockResolvedValue("src/env");

      await promptEnv(config);

      expect(config.get("env").options.variant).toBe("@t3-oss/env-nextjs");
      expect(config.get("env").options.validator).toBe("zod");
    });

    it("should install env", async () => {
      config.get("env").options = {
        variant: "@t3-oss/env-nextjs",
        validator: "zod",
        installPresets: false,
        presets: [],
        split: "split",
        location: "src/env",
      };

      await installEnv(config);

      expect(pm.installPackages).toHaveBeenCalledWith(
        ["@t3-oss/env-nextjs", "zod"],
        false,
      );
    });
  });

  describe("Test", () => {
    it("should prompt for test runner", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("vitest");
      await promptTest(config);
      expect(config.get("test").options.runner).toBe("vitest");
    });

    it("should install test runner", async () => {
      config.get("test").options.runner = "vitest";
      await installTest(config);
      expect(pm.installPackages).toHaveBeenCalledWith(["vitest"], true);
    });
  });

  describe("EditorConfig", () => {
    it("should prompt for editorconfig", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("default");
      await promptEditorConfig(config);
      expect(config.get("editorConfig").options.preset).toBe("default");
    });

    it("should install editorconfig", async () => {
      config.get("editorConfig").options.preset = "default";
      await installEditorConfig(config);
      expect(fs.outputFile).toHaveBeenCalled();
    });
  });

  describe("License", () => {
    it("should prompt for license", async () => {
      vi.spyOn(prompts, "select").mockResolvedValue("MIT");
      vi.spyOn(prompts, "text").mockResolvedValue("Author");

      await promptLicense(config);

      expect(config.get("license").options.type).toBe("MIT");
      expect(config.get("license").options.name).toBe("Author");
    });
    it("should install license", async () => {
      config.get("license").options = {
        type: "MIT",
        name: "Author",
        email: "email@test.com",
        website: "website.com",
      };

      vi.spyOn(fs, "pathExists").mockResolvedValue();
      vi.spyOn(fs, "readJson").mockResolvedValue({});

      await installLicense(config);
      expect(fs.outputFile).toHaveBeenCalled();
    });
  });
});
