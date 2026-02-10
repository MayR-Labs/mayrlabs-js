export type Option<V extends string> = {
  value: V;
  label: string;
};

type OptionValue<T extends readonly Option<string>[]> = T[number]["value"];

type OptionLabel<T extends readonly Option<string>[]> = T[number]["label"];

type OptionOf<T extends readonly Option<string>[]> = Option<OptionValue<T>>;

export const TOOL_OPTIONS = [
  { value: "husky", label: "Husky" },
  { value: "formatter", label: "Formatter (Prettier/Oxfmt)" },
  { value: "linter", label: "Linter (Eslint/Oxlint)" },
  { value: "lint-staged", label: "Lint-staged" },
  { value: "env", label: "Env Validation (@t3-oss/env)" },
  { value: "test", label: "Test Runner (Vitest/Jest)" },
  { value: "editorConfig", label: "EditorConfig" },
  { value: "license", label: "License" },
] as const satisfies Option<string>[];

export type ToolValue = OptionValue<typeof TOOL_OPTIONS>;

export const HUSKY_HOOK_OPTIONS = [
  { value: "lint-staged", label: "lint-staged" },
  { value: "custom", label: "Custom script" },
  { value: "none", label: "None" },
] as const satisfies Option<string>[];

export type HuskyHookValue = OptionValue<typeof HUSKY_HOOK_OPTIONS>;

export const FORMATTER_OPTIONS = [
  { value: "prettier", label: "Prettier" },
  { value: "oxfmt", label: "Oxfmt" },
] as const satisfies Option<string>[];

export type FormatterValue = OptionValue<typeof FORMATTER_OPTIONS>;

export const LINTER_OPTIONS = [
  { value: "eslint", label: "ESLint" },
  { value: "oxlint", label: "Oxlint" },
] as const satisfies Option<string>[];

export type LinterValue = OptionValue<typeof LINTER_OPTIONS>;

export const LINT_STAGED_EXTENSIONS = [
  { value: "js", label: "js" },
  { value: "ts", label: "ts" },
  { value: "jsx", label: "jsx" },
  { value: "tsx", label: "tsx" },
  { value: "html", label: "html" },
  { value: "vue", label: "vue" },
  { value: "svelte", label: "svelte" },
  { value: "css", label: "css" },
  { value: "scss", label: "scss" },
  { value: "json", label: "json" },
  { value: "yaml", label: "yaml" },
  { value: "md", label: "md" },
] as const satisfies Option<string>[];

export type LintStagedExtensionValue = OptionValue<
  typeof LINT_STAGED_EXTENSIONS
>;

export const ENV_VARIANT_OPTIONS = [
  { value: "@t3-oss/env-nextjs", label: "Next.js" },
  { value: "@t3-oss/env-nuxt", label: "Nuxt" },
  { value: "@t3-oss/env-core", label: "Core" },
] as const satisfies Option<string>[];

export type EnvVariantValue = OptionValue<typeof ENV_VARIANT_OPTIONS>;

export const ENV_VALIDATOR_OPTIONS = [
  { value: "zod", label: "Zod" },
  { value: "valibot", label: "Valibot" },
  { value: "arktype", label: "Arktype" },
] as const satisfies Option<string>[];

export type EnvValidatorValue = OptionValue<typeof ENV_VALIDATOR_OPTIONS>;

export const ENV_PRESET_OPTIONS = [
  { value: "netlify", label: "Netlify" },
  { value: "vercel", label: "Vercel" },
  { value: "neonVercel", label: "Neon (Vercel)" },
  { value: "supabaseVercel", label: "Supabase (Vercel)" },
  { value: "uploadThing", label: "UploadThing" },
  { value: "render", label: "Render" },
  { value: "railway", label: "Railway" },
  { value: "fly.io", label: "Fly.io" },
  { value: "upstashRedis", label: "Upstash Redis" },
  { value: "coolify", label: "Coolify" },
  { value: "vite", label: "Vite" },
  { value: "wxt", label: "WXT" },
] as const satisfies Option<string>[];

export type EnvPresetValue = OptionValue<typeof ENV_PRESET_OPTIONS>;

export const ENV_SPLIT_OPTIONS = [
  { value: "split", label: "Split (env/server.ts, env/client.ts)" },
  { value: "joined", label: "Joined (env.ts)" },
] as const satisfies Option<string>[];

export type EnvSplitValue = OptionValue<typeof ENV_SPLIT_OPTIONS>;

export const TEST_RUNNER_OPTIONS = [
  { value: "vitest", label: "Vitest" },
  { value: "jest", label: "Jest" },
] as const satisfies Option<string>[];

export type TestRunnerValue = OptionValue<typeof TEST_RUNNER_OPTIONS>;

export const EDITOR_CONFIG_OPTIONS = [
  { value: "default", label: "Default (Spaces 2)" },
  { value: "spaces4", label: "Spaces 4" },
  { value: "tabs", label: "Tabs" },
] as const satisfies Option<string>[];

export type EditorConfigValue = OptionValue<typeof EDITOR_CONFIG_OPTIONS>;

export const LICENSE_TYPE_OPTIONS = [
  { value: "MIT", label: "MIT" },
  { value: "ISC", label: "ISC" },
  { value: "Apache-2.0", label: "Apache 2.0" },
  { value: "UNLICENSED", label: "UNLICENSED" },
] as const satisfies Option<string>[];

export type LicenseTypeValue = OptionValue<typeof LICENSE_TYPE_OPTIONS>;
