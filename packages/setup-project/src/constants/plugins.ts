import { Option } from "@/config/types";

export interface PluginOption extends Option {
  package: string;
}

const ESLINT_PLUGINS: PluginOption[] = [
  {
    value: "depend",
    label: "depend",
    package: "eslint-plugin-depend",
    hint: "Detect junk dependencies",
  },
  {
    value: "github",
    label: "github",
    package: "eslint-plugin-github",
    hint: "GitHub's ESLint rules",
  },
  {
    value: "sonarjs",
    label: "sonarjs",
    package: "eslint-plugin-sonarjs",
    hint: "Detect bugs and suspicious patterns",
  },
  {
    value: "unicorn",
    label: "unicorn",
    package: "eslint-plugin-unicorn",
    hint: "More powerful rules",
  },
  {
    value: "de-morgan",
    label: "de-morgan",
    package: "eslint-plugin-de-morgan",
    hint: "Enforce De Morgan's laws",
  },
  {
    value: "compat",
    label: "compat",
    package: "eslint-plugin-compat",
    hint: "Browser compatibility checking",
  },
  {
    value: "css-modules",
    label: "css-modules",
    package: "eslint-plugin-css-modules",
  },
  {
    value: "deprecate",
    label: "deprecate",
    package: "eslint-plugin-deprecate",
  },
  {
    value: "html",
    label: "html",
    package: "eslint-plugin-html",
    hint: "Linting for HTML files",
  },
  {
    value: "markdown",
    label: "markdown",
    package: "eslint-plugin-markdown",
    hint: "Linting for Markdown files",
  },
  {
    value: "angular",
    label: "angular",
    package: "@angular-eslint/eslint-plugin",
  },
  { value: "astro", label: "astro", package: "eslint-plugin-astro" },
  { value: "backbone", label: "backbone", package: "eslint-plugin-backbone" },
  { value: "ember", label: "ember", package: "eslint-plugin-ember" },
  { value: "hapi", label: "hapi", package: "eslint-plugin-hapi" },
  { value: "meteor", label: "meteor", package: "eslint-plugin-meteor" },
  { value: "react", label: "react", package: "eslint-plugin-react" },
  {
    value: "react-hooks",
    label: "react-hooks",
    package: "eslint-plugin-react-hooks",
  },
  {
    value: "react-native",
    label: "react-native",
    package: "eslint-plugin-react-native",
  },
  {
    value: "react-redux",
    label: "react-redux",
    package: "eslint-plugin-react-redux",
  },
  {
    value: "react-refresh",
    label: "react-refresh",
    package: "eslint-plugin-react-refresh",
  },
  { value: "solid", label: "solid", package: "eslint-plugin-solid" },
  { value: "svelte", label: "svelte", package: "eslint-plugin-svelte" },
  { value: "vuejs", label: "vuejs", package: "eslint-plugin-vue" },
  { value: "json", label: "json", package: "eslint-plugin-json" },
  { value: "mdx", label: "mdx", package: "eslint-plugin-mdx" },
  {
    value: "typescript",
    label: "typescript",
    package: "@typescript-eslint/eslint-plugin",
  },
  { value: "yaml", label: "yaml", package: "eslint-plugin-yaml" },
  { value: "mongodb", label: "mongodb", package: "eslint-plugin-mongodb" },
  { value: "jquery", label: "jquery", package: "eslint-plugin-jquery" },
  { value: "jsdoc", label: "jsdoc", package: "eslint-plugin-jsdoc" },
  { value: "lodash", label: "lodash", package: "eslint-plugin-lodash" },
  {
    value: "requirejs",
    label: "requirejs",
    package: "eslint-plugin-requirejs",
  },
  {
    value: "tailwindcss",
    label: "tailwindcss",
    package: "eslint-plugin-tailwindcss",
  },
  { value: "import", label: "import", package: "eslint-plugin-import" },
  {
    value: "no-comments",
    label: "no-comments",
    package: "eslint-plugin-no-comments",
  },
  {
    value: "exception-handling",
    label: "exception-handling",
    package: "eslint-plugin-exception-handling",
  },
  {
    value: "fp",
    label: "fp",
    package: "eslint-plugin-fp",
    hint: "Functional programming rules",
  },
  {
    value: "no-secrets",
    label: "no-secrets",
    package: "eslint-plugin-no-secrets",
  },
  {
    value: "no-unsanitized",
    label: "no-unsanitized",
    package: "eslint-plugin-no-unsanitized",
  },
  { value: "security", label: "security", package: "eslint-plugin-security" },
  { value: "xss", label: "xss", package: "eslint-plugin-xss" },
  {
    value: "const-case",
    label: "const-case",
    package: "eslint-plugin-const-case",
  },
  { value: "cypress", label: "cypress", package: "eslint-plugin-cypress" },
  { value: "jest", label: "jest", package: "eslint-plugin-jest" },
  { value: "mocha", label: "mocha", package: "eslint-plugin-mocha" },
  { value: "node", label: "node", package: "eslint-plugin-node" },
  { value: "promise", label: "promise", package: "eslint-plugin-promise" },
  { value: "standard", label: "standard", package: "eslint-plugin-standard" },
];

const PRETTIER_PLUGINS: PluginOption[] = [
  {
    value: "tailwindcss",
    label: "tailwindcss",
    package: "prettier-plugin-tailwindcss",
  },
  {
    value: "organize-imports",
    label: "organize-imports",
    package: "prettier-plugin-organize-imports",
  },
  {
    value: "sort-imports",
    label: "sort-imports",
    package: "@trivago/prettier-plugin-sort-imports",
  },
  { value: "astro", label: "astro", package: "prettier-plugin-astro" },
  { value: "svelte", label: "svelte", package: "prettier-plugin-svelte" },
  { value: "vue", label: "vue", package: "prettier-plugin-vue" },
  { value: "prisma", label: "prisma", package: "prettier-plugin-prisma" },
  { value: "java", label: "java", package: "prettier-plugin-java" },
  { value: "php", label: "php", package: "@prettier/plugin-php" },
  { value: "ruby", label: "ruby", package: "@prettier/plugin-ruby" },
  { value: "xml", label: "xml", package: "@prettier/plugin-xml" },
  { value: "sh", label: "sh", package: "prettier-plugin-sh" },
  {
    value: "pkg",
    label: "pkg",
    package: "prettier-plugin-pkg",
    hint: "Format package.json",
  },
];

export const PLUGINS = {
  eslint: ESLINT_PLUGINS,
  prettier: PRETTIER_PLUGINS,
};

export const PLUGINABLE_TOOLS = Object.keys(PLUGINS);

export type PluginableToolType = keyof typeof PLUGINS;
