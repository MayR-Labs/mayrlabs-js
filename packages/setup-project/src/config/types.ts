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

export interface HuskyOptions {
  hookType: HuskyHookValue;
  customScript?: string;
}

export interface FormatterOptions {
  choice: FormatterValue;
}

export interface LinterOptions {
  choice: LinterValue;
}

export interface LintStagedOptions {
  lintExtensions: LintStagedExtensionValue[];
  formatExtensions: LintStagedExtensionValue[];
}

export interface EnvOptions {
  variant: EnvVariantValue;
  validator: EnvValidatorValue;
  installPresets: boolean;
  presets: EnvPresetValue[];
  split: EnvSplitValue;
  location: string;
}

export interface TestOptions {
  runner: TestRunnerValue;
}

export interface EditorConfigOptions {
  preset: EditorConfigValue;
}

export interface LicenseOptions {
  type: LicenseTypeValue;
  name: string;
  email: string;
  website: string;
}

export interface ProjectConfig {
  husky: { selected: boolean; options: HuskyOptions };
  formatter: { selected: boolean; options: FormatterOptions };
  linter: { selected: boolean; options: LinterOptions };
  lintStaged: { selected: boolean; options: LintStagedOptions };
  env: { selected: boolean; options: EnvOptions };
  test: { selected: boolean; options: TestOptions };
  editorConfig: { selected: boolean; options: EditorConfigOptions };
  license: { selected: boolean; options: LicenseOptions };
}

export type Tool = keyof ProjectConfig;
