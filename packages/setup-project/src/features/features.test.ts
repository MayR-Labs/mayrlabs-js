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
import { prompts } from "@/utils/prompts";
import fs from "fs-extra";
import { configureEslintPlugins } from "@/features/linter/eslint";

vi.mock("@/utils/pm");
vi.mock("fs-extra");
vi.mock("execa");
vi.mock("@/utils/config-file", () => ({
  resolveConfigFile: vi.fn(),
  writeConfig: vi.fn(),
}));
vi.mock("@/utils/prompts", () => ({
  prompts: {
    intro: vi.fn(),
    outro: vi.fn(),
    select: vi.fn(),
    text: vi.fn(),
    confirm: vi.fn(),
    multiselect: vi.fn(),
    isCancel: vi.fn((val) => val === Symbol("cancel")),
    log: {
      message: vi.fn(),
      step: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
    },
  },
}));

describe("Features", () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
    vi.clearAllMocks();
    // Default mock implementation for prompts to avoid hanging
    vi.mocked(prompts.select).mockResolvedValue("some-value" as any);
    vi.mocked(prompts.text).mockResolvedValue("some-text" as any);
    vi.mocked(prompts.confirm).mockResolvedValue(true as any);
    vi.mocked(prompts.multiselect).mockResolvedValue([] as any);
  });

  describe("Husky", () => {
    it("should prompt for husky options", async () => {
      vi.mocked(prompts.select).mockResolvedValue("custom" as any);
      vi.mocked(prompts.text).mockResolvedValue("echo test" as any);

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
      vi.mocked(prompts.select).mockResolvedValue("prettier" as any);
      await promptFormatter(config);
      expect(config.get("formatter").options.choice).toBe("prettier");
    });

    it("should install prettier", async () => {
      config.get("formatter").options.choice = "prettier";
      vi.mocked(prompts.confirm).mockResolvedValue(false as any); // Don't install plugins

      await installFormatter(config);

      expect(pm.installPackages).toHaveBeenCalledWith(["prettier"], true);
    });
  });

  describe("Linter", () => {
    it("should prompt for linter", async () => {
      vi.mocked(prompts.select).mockResolvedValue("eslint" as any);
      await promptLinter(config);
      expect(config.get("linter").options.choice).toBe("eslint");
    });

    it("should install eslint", async () => {
      config.get("linter").options.choice = "eslint";
      vi.mocked(prompts.confirm).mockResolvedValue(false as any);

      await installLinter(config);

      expect(pm.installPackages).toHaveBeenCalledWith(
        expect.arrayContaining(["eslint"]),
        true
      );
    });

    it("should configure eslint plugins in eslint.config.mjs", async () => {
      const initialConfig = `import globals from "globals";
export default [
  {files: ["**/*.js"]},
];`;

      const { resolveConfigFile } = await import("@/utils/config-file");
      vi.mocked(resolveConfigFile).mockResolvedValue("eslint.config.mjs");

      // @ts-ignore
      vi.spyOn(fs, "pathExists").mockResolvedValue(true);
      // @ts-ignore
      vi.spyOn(fs, "readFile").mockResolvedValue(initialConfig);
      vi.spyOn(fs, "writeFile").mockResolvedValue();

      await configureEslintPlugins(["react", "react-hooks"]);

      // Verify fs.writeFile was called with updated config
      expect(fs.writeFile).toHaveBeenCalledWith(
        "eslint.config.mjs",
        expect.stringContaining(
          'import reactPlugin from "eslint-plugin-react";'
        )
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        "eslint.config.mjs",
        expect.stringContaining(
          'import reacthooksPlugin from "eslint-plugin-react-hooks";'
        )
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        "eslint.config.mjs",
        expect.stringContaining('"react": reactPlugin')
      );
    });
  });

  describe("Lint Staged", () => {
    it("should prompt for lint-staged", async () => {
      vi.mocked(prompts.multiselect).mockResolvedValue(["ts"] as any);

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
      vi.mocked(prompts.select)
        .mockResolvedValueOnce("@t3-oss/env-nextjs" as any)
        .mockResolvedValueOnce("zod" as any)
        .mockResolvedValueOnce("split" as any);
      vi.mocked(prompts.confirm).mockResolvedValue(false as any);
      vi.mocked(prompts.text).mockResolvedValue("src/env" as any);

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
        false
      );
    });
  });

  describe("Test", () => {
    it("should prompt for test runner", async () => {
      vi.mocked(prompts.select).mockResolvedValue("vitest" as any);
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
      vi.mocked(prompts.select).mockResolvedValue("default" as any);
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
      vi.mocked(prompts.select).mockResolvedValue("MIT" as any);
      vi.mocked(prompts.text).mockResolvedValue("Author" as any);

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

      // @ts-ignore
      vi.spyOn(fs, "pathExists").mockResolvedValue(false);
      vi.spyOn(fs, "readJson").mockResolvedValue({});

      await installLicense(config);
      expect(fs.outputFile).toHaveBeenCalled();
    });
  });
});
