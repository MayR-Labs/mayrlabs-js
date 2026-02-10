import {
  EditorConfigValue,
  HuskyHookValue,
  FormatterValue,
  LinterValue,
  LintStagedExtensionValue,
  EnvVariantValue,
  EnvValidatorValue,
  EnvPresetValue,
  EnvSplitValue,
  TestRunnerValue,
  LicenseTypeValue,
} from "@/constants/options";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

export interface HuskyConfig {
  hookType: HuskyHookValue;
  customScript?: string;
}

export interface FormatterConfig {
  choice: FormatterValue;
}

export interface LinterConfig {
  choice: LinterValue;
}

export interface LintStagedConfig {
  lintExtensions: LintStagedExtensionValue[];
  formatExtensions: LintStagedExtensionValue[];
}

export interface EnvConfig {
  variant: EnvVariantValue;
  validator: EnvValidatorValue;
  installPresets?: boolean;
  presets?: EnvPresetValue[];
  split?: EnvSplitValue;
  location?: string;
}

export interface TestConfig {
  runner: TestRunnerValue;
}

export interface EditorConfigConfig {
  preset: EditorConfigValue;
}

export interface LicenseConfig {
  type: LicenseTypeValue;
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
