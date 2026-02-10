import { EditorConfigValue } from "@/constants/options";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

export interface HuskyConfig {
  hookType: "lint-staged" | "custom" | "none";
  customScript?: string;
}

export interface FormatterConfig {
  choice: "prettier" | "oxfmt";
}

export interface LinterConfig {
  choice: "eslint" | "oxlint";
}

export interface LintStagedConfig {
  lintExtensions: string[];
  formatExtensions: string[];
}

export interface EnvConfig {
  variant: "@t3-oss/env-nextjs" | "@t3-oss/env-nuxt" | "@t3-oss/env-core";
  validator: "zod" | "valibot" | "arktype";
  installPresets?: boolean;
  presets?: string[];
  split?: "split" | "joined";
  location?: string;
}

export interface TestConfig {
  runner: "vitest" | "jest";
}

export interface EditorConfigConfig {
  preset: EditorConfigValue;
}

export interface LicenseConfig {
  type: "MIT" | "ISC" | "Apache-2.0" | "UNLICENSED";
  name: string;
  email: string;
  website: string;
}

export interface ProjectConfig {
  husky: { selected: boolean; config?: HuskyConfig };
  formatter: { selected: boolean; config?: FormatterConfig };
  linter: { selected: boolean; config?: LinterConfig };
  lintStaged: { selected: boolean; config?: LintStagedConfig };
  env: { selected: boolean; config?: EnvConfig };
  test: { selected: boolean; config?: TestConfig };
  editorConfig: { selected: boolean; config?: EditorConfigConfig };
  license: { selected: boolean; config: LicenseConfig };
}

export type Tool = keyof ProjectConfig;
