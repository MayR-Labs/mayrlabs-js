import { Option } from "@/core/types";

export interface PluginOption extends Option {
  package: string;
}

const ESLINT_PLUGINS: PluginOption[] = [
  // Code Quality
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
    hint: "Various awesome ESLint rules",
  },
  {
    value: "mysticatea",
    label: "mysticatea",
    package: "@mysticatea/eslint-plugin",
    hint: "Misc rules",
  },
  {
    value: "brettz9",
    label: "brettz9",
    package: "@brettz9/eslint-plugin",
    hint: "Misc rules without personal config",
  },
  {
    value: "de-morgan",
    label: "de-morgan",
    package: "eslint-plugin-de-morgan",
    hint: "Transform logical expressions",
  },
  {
    value: "code-complete",
    label: "code-complete",
    package: "eslint-plugin-code-complete",
    hint: "Clean, maintainable software design",
  },

  // Compatibility
  {
    value: "compat",
    label: "compat",
    package: "eslint-plugin-compat",
    hint: "Browser compatibility checking",
  },
  {
    value: "es-compat",
    label: "es-compat",
    package: "eslint-plugin-es-compat",
    hint: "Disable unsupported ES features",
  },
  {
    value: "es-x",
    label: "es-x",
    package: "eslint-plugin-es-x",
    hint: "Disable specific ES versions",
  },
  {
    value: "es5",
    label: "es5",
    package: "eslint-plugin-es5",
    hint: "Forbid ES2015+ usage",
  },
  {
    value: "ie11",
    label: "ie11",
    package: "eslint-plugin-ie11",
    hint: "Detect unsupported ES6 features in IE11",
  },

  // CSS in JS
  {
    value: "css-modules",
    label: "css-modules",
    package: "eslint-plugin-css-modules",
    hint: "Lint css modules",
  },
  {
    value: "emotion",
    label: "emotion",
    package: "@emotion/eslint-plugin",
    hint: "Rules for emotion",
  },
  {
    value: "better-styled-components",
    label: "better-styled-components",
    package: "eslint-plugin-better-styled-components",
    hint: "Auto fixable rules for styled components",
  },
  {
    value: "styled-components-a11y",
    label: "styled-components-a11y",
    package: "eslint-plugin-styled-components-a11y",
    hint: "A11y for Styled Components",
  },
  {
    value: "vanilla-extract",
    label: "vanilla-extract",
    package: "@vanilla-extract/eslint-plugin",
    hint: "Enforce CSS property ordering",
  },

  // Deprecation
  {
    value: "deprecate",
    label: "deprecate",
    package: "eslint-plugin-deprecate",
    hint: "Mark functions/modules as deprecated",
  },
  {
    value: "disable",
    label: "disable",
    package: "eslint-plugin-disable",
    hint: "Disable plugins using patterns",
  },

  // Embedded
  {
    value: "html",
    label: "html",
    package: "eslint-plugin-html",
    hint: "Linting JS inside HTML",
  },
  {
    value: "markdown",
    label: "markdown",
    package: "eslint-plugin-markdown",
    hint: "Linting JS inside Markdown",
  },

  // Frameworks
  {
    value: "angular",
    label: "angular",
    package: "@angular-eslint/eslint-plugin",
    hint: "Linting for Angular",
  },
  {
    value: "angularjs",
    label: "angularjs",
    package: "eslint-plugin-angular",
    hint: "Linting for AngularJS",
  },
  {
    value: "astro",
    label: "astro",
    package: "eslint-plugin-astro",
    hint: "Linting for Astro",
  },
  {
    value: "backbone",
    label: "backbone",
    package: "eslint-plugin-backbone",
    hint: "Linting for Backbone",
  },
  {
    value: "ember",
    label: "ember",
    package: "eslint-plugin-ember",
    hint: "Linting for Ember",
  },
  {
    value: "hapi",
    label: "hapi",
    package: "eslint-plugin-hapi",
    hint: "Linting for Hapi",
  },
  {
    value: "meteor",
    label: "meteor",
    package: "eslint-plugin-meteor",
    hint: "Linting for Meteor",
  },
  {
    value: "jsx-a11y",
    label: "jsx-a11y",
    package: "eslint-plugin-jsx-a11y",
    hint: "Accessibility rules on JSX",
  },
  {
    value: "react",
    label: "react",
    package: "eslint-plugin-react",
    hint: "Linting for React/JSX",
  },
  {
    value: "react-hooks",
    label: "react-hooks",
    package: "eslint-plugin-react-hooks",
    hint: "Linting for React Hooks",
  },
  {
    value: "react-native",
    label: "react-native",
    package: "eslint-plugin-react-native",
    hint: "React Native specific rules",
  },
  {
    value: "react-redux",
    label: "react-redux",
    package: "eslint-plugin-react-redux",
    hint: "React-Redux specific rules",
  },
  {
    value: "react-refresh",
    label: "react-refresh",
    package: "eslint-plugin-react-refresh",
    hint: "Improve HMR with Vite",
  },
  {
    value: "solid",
    label: "solid",
    package: "eslint-plugin-solid",
    hint: "Linting for Solid",
  },
  {
    value: "svelte",
    label: "svelte",
    package: "eslint-plugin-svelte",
    hint: "Linting for Svelte",
  },
  {
    value: "vuejs",
    label: "vuejs",
    package: "eslint-plugin-vue",
    hint: "Linting for VueJS",
  },
  {
    value: "vue-scoped-css",
    label: "vue-scoped-css",
    package: "eslint-plugin-vue-scoped-css",
    hint: "Scoped CSS in VueJS",
  },

  // Languages and Environments
  {
    value: "babel",
    label: "babel",
    package: "@babel/eslint-plugin",
    hint: "Babel features",
  },
  {
    value: "flowtype",
    label: "flowtype",
    package: "eslint-plugin-flowtype",
    hint: "Flow type linting",
  },
  {
    value: "flowtype-errors",
    label: "flowtype-errors",
    package: "eslint-plugin-flowtype-errors",
    hint: "Run Flow as plugin",
  },
  {
    value: "html-eslint",
    label: "html-eslint",
    package: "@html-eslint/eslint-plugin",
    hint: "Linting for HTML",
  },
  {
    value: "json",
    label: "json",
    package: "eslint-plugin-json",
    hint: "Lint JSON files",
  },
  {
    value: "json-format",
    label: "json-format",
    package: "eslint-plugin-json-format",
    hint: "Lint/Format/Fix JSON",
  },
  {
    value: "jsonc",
    label: "jsonc",
    package: "eslint-plugin-jsonc",
    hint: "JSON with comments",
  },
  {
    value: "json-schema-validator",
    label: "json-schema-validator",
    package: "eslint-plugin-json-schema-validator",
    hint: "Validate data using JSON Schema",
  },
  {
    value: "package-json",
    label: "package-json",
    package: "eslint-plugin-package-json",
    hint: "Rules for package.json",
  },
  {
    value: "mdx",
    label: "mdx",
    package: "eslint-plugin-mdx",
    hint: "Lint MDX",
  },
  { value: "n", label: "n", package: "eslint-plugin-n", hint: "Node.js rules" },
  {
    value: "sql",
    label: "sql",
    package: "eslint-plugin-sql",
    hint: "SQL linting",
  },
  {
    value: "toml",
    label: "toml",
    package: "eslint-plugin-toml",
    hint: "Lint TOML",
  },
  {
    value: "typescript",
    label: "typescript",
    package: "@typescript-eslint/eslint-plugin",
    hint: "Lint TypeScript",
  },
  {
    value: "erasable-syntax-only",
    label: "erasable-syntax-only",
    package: "eslint-plugin-erasable-syntax-only",
    hint: "Enforce TS erasableSyntaxOnly",
  },
  {
    value: "expect-type",
    label: "expect-type",
    package: "eslint-plugin-expect-type",
    hint: "Type assertions",
  },
  {
    value: "yaml",
    label: "yaml",
    package: "eslint-plugin-yml",
    hint: "Lint YAML",
  },

  // Libraries
  {
    value: "graphql",
    label: "graphql",
    package: "@graphql-eslint/eslint-plugin",
    hint: "Validate GraphQL operations/schema",
  },
  {
    value: "graphql-schema",
    label: "graphql-schema",
    package: "eslint-plugin-graphql",
    hint: "Check GraphQL queries against schema",
  },
  {
    value: "type-graphql",
    label: "type-graphql",
    package: "eslint-plugin-type-graphql",
    hint: "Lint TypeGraphQL",
  },
  {
    value: "jquery",
    label: "jquery",
    package: "eslint-plugin-no-jquery",
    hint: "Lint jQuery (deprecated features)",
  },
  {
    value: "jsdoc",
    label: "jsdoc",
    package: "eslint-plugin-jsdoc",
    hint: "Lint JSDoc comments",
  },
  {
    value: "lodash",
    label: "lodash",
    package: "eslint-plugin-lodash",
    hint: "Lodash rules",
  },
  {
    value: "lodash-fp",
    label: "lodash-fp",
    package: "eslint-plugin-lodash-fp",
    hint: "Lodash/fp rules",
  },
  {
    value: "lodash-template",
    label: "lodash-template",
    package: "eslint-plugin-lodash-template",
    hint: "Lodash template rules",
  },
  {
    value: "microtemplates",
    label: "microtemplates",
    package: "eslint-plugin-microtemplates",
    hint: "Microtemplates rules",
  },
  {
    value: "mongodb",
    label: "mongodb",
    package: "eslint-plugin-mongodb",
    hint: "MongoDB driver rules",
  },
  {
    value: "ramda",
    label: "ramda",
    package: "eslint-plugin-ramda",
    hint: "Ramda rules",
  },
  {
    value: "requirejs",
    label: "requirejs",
    package: "eslint-plugin-requirejs",
    hint: "RequireJS rules",
  },
  {
    value: "tailwindcss",
    label: "tailwindcss",
    package: "eslint-plugin-tailwindcss",
    hint: "Tailwind CSS rules",
  },
  {
    value: "better-tailwindcss",
    label: "better-tailwindcss",
    package: "eslint-plugin-better-tailwindcss",
    hint: "Improve readability/best practices",
  },

  // Misc
  {
    value: "diff",
    label: "diff",
    package: "eslint-plugin-diff",
    hint: "Lint changed lines only",
  },
  {
    value: "misc",
    label: "misc",
    package: "eslint-plugin-misc",
    hint: "Miscellaneous rules",
  },
  {
    value: "notice",
    label: "notice",
    package: "eslint-plugin-notice",
    hint: "Check top of files",
  },
  {
    value: "only-error",
    label: "only-error",
    package: "eslint-plugin-only-error",
    hint: "Convert all rules to errors",
  },
  {
    value: "only-warn",
    label: "only-warn",
    package: "eslint-plugin-only-warn",
    hint: "Convert all rules to warnings",
  },
  {
    value: "putout",
    label: "putout",
    package: "eslint-plugin-putout",
    hint: "Integrate PutOut linter",
  },
  {
    value: "typelint",
    label: "typelint",
    package: "eslint-plugin-typelint",
    hint: "Introduce types based on schemas",
  },
  {
    value: "woke",
    label: "woke",
    package: "eslint-plugin-woke",
    hint: "Catch insensitive words",
  },

  // Practices and Specific ES Features
  {
    value: "array-func",
    label: "array-func",
    package: "eslint-plugin-array-func",
    hint: "Avoid redundancy with array methods",
  },
  {
    value: "proper-arrows",
    label: "proper-arrows",
    package: "eslint-plugin-proper-arrows",
    hint: "Ensure proper arrow function definitions",
  },
  {
    value: "boundaries",
    label: "boundaries",
    package: "eslint-plugin-boundaries",
    hint: "Enforce architecture boundaries",
  },
  {
    value: "eslint-comments",
    label: "eslint-comments",
    package: "eslint-plugin-eslint-comments",
    hint: "Best practices for ESLint directives",
  },
  {
    value: "error-cause",
    label: "error-cause",
    package: "eslint-plugin-error-cause",
    hint: "Preserve error context",
  },
  {
    value: "hexagonal-architecture",
    label: "hexagonal-architecture",
    package: "eslint-plugin-hexagonal-architecture",
    hint: "Hexagonal architecture best practices",
  },
  {
    value: "signature-design",
    label: "signature-design",
    package: "eslint-plugin-signature-design",
    hint: "Enforce object-based signatures",
  },
  {
    value: "write-good-comments",
    label: "write-good-comments",
    package: "eslint-plugin-write-good-comments",
    hint: "Enforce good comment style",
  },
  {
    value: "exception-handling",
    label: "exception-handling",
    package: "eslint-plugin-exception-handling",
    hint: "Lint unhandled exceptions",
  },
  {
    value: "fp",
    label: "fp",
    package: "eslint-plugin-fp",
    hint: "Functional programming rules",
  },
  {
    value: "functional",
    label: "functional",
    package: "eslint-plugin-functional",
    hint: "Disable mutation, promote FP",
  },
  {
    value: "mutate",
    label: "mutate",
    package: "eslint-plugin-mutate",
    hint: "Prevent accidental mutations",
  },
  {
    value: "immutable",
    label: "immutable",
    package: "eslint-plugin-immutable",
    hint: "Disable all mutation",
  },
  {
    value: "import",
    label: "import",
    package: "eslint-plugin-import",
    hint: "Lint import/export syntax",
  },
  {
    value: "import-x",
    label: "import-x",
    package: "eslint-plugin-import-x",
    hint: "Lightweight fork of eslint-plugin-import",
  },
  {
    value: "math",
    label: "math",
    package: "eslint-plugin-math",
    hint: "Math object rules",
  },
  {
    value: "new-with-error",
    label: "new-with-error",
    package: "eslint-plugin-new-with-error",
    hint: "Require new with Error",
  },
  {
    value: "no-argument-spread",
    label: "no-argument-spread",
    package: "eslint-plugin-no-argument-spread",
    hint: "Lint against spread arguments",
  },
  {
    value: "no-comments",
    label: "no-comments",
    package: "eslint-plugin-no-comments",
    hint: "Prevent leaking comments",
  },
  {
    value: "no-constructor-bind",
    label: "no-constructor-bind",
    package: "eslint-plugin-no-constructor-bind",
    hint: "Encourage class properties",
  },
  {
    value: "no-inferred-method-name",
    label: "no-inferred-method-name",
    package: "eslint-plugin-no-inferred-method-name",
    hint: "Check inferred method names",
  },
  {
    value: "no-loops",
    label: "no-loops",
    package: "eslint-plugin-no-loops",
    hint: "Disallow loops",
  },
  {
    value: "query",
    label: "query",
    package: "eslint-plugin-query",
    hint: "Show queried syntax content",
  },
  {
    value: "no-use-extend-native",
    label: "no-use-extend-native",
    package: "eslint-plugin-no-use-extend-native",
    hint: "Prevent using extended native objects",
  },
  {
    value: "promise",
    label: "promise",
    package: "eslint-plugin-promise",
    hint: "Promise best practices",
  },
  {
    value: "pure",
    label: "pure",
    package: "eslint-plugin-pure",
    hint: "Enforce pure functions",
  },
  {
    value: "redos",
    label: "redos",
    package: "eslint-plugin-redos",
    hint: "Find ReDoS vulnerabilities",
  },
  {
    value: "redos-detector",
    label: "redos-detector",
    package: "eslint-plugin-redos-detector",
    hint: "Find ReDoS vulnerabilities",
  },
  {
    value: "regexp",
    label: "regexp",
    package: "eslint-plugin-regexp",
    hint: "Find regexp mistakes",
  },
  {
    value: "sort-keys-fix",
    label: "sort-keys-fix",
    package: "eslint-plugin-sort-keys-fix",
    hint: "Fixer for sort-keys",
  },
  {
    value: "this",
    label: "this",
    package: "eslint-plugin-this",
    hint: "Disallow this",
  },
  {
    value: "toplevel",
    label: "toplevel",
    package: "eslint-plugin-toplevel",
    hint: "Disallow side effects at top level",
  },

  // Performance
  {
    value: "dom",
    label: "dom",
    package: "eslint-plugin-dom",
    hint: "DOM performance",
  },
  {
    value: "optimize-regex",
    label: "optimize-regex",
    package: "eslint-plugin-optimize-regex",
    hint: "Optimize regex literals",
  },
  {
    value: "perf-standard",
    label: "perf-standard",
    package: "eslint-plugin-perf-standard",
    hint: "Performance standard rules",
  },

  // Security
  {
    value: "no-secrets",
    label: "no-secrets",
    package: "eslint-plugin-no-secrets",
    hint: "Detect potential secrets",
  },
  {
    value: "no-unsanitized",
    label: "no-unsanitized",
    package: "eslint-plugin-no-unsanitized",
    hint: "Checks for innerHTML etc",
  },
  {
    value: "pii",
    label: "pii",
    package: "eslint-plugin-pii",
    hint: "Enforce PII compliance",
  },
  {
    value: "pg",
    label: "pg",
    package: "eslint-plugin-pg",
    hint: "PostgreSQL security",
  },
  {
    value: "security",
    label: "security",
    package: "eslint-plugin-security",
    hint: "Node Security rules",
  },
  {
    value: "xss",
    label: "xss",
    package: "eslint-plugin-xss",
    hint: "Detect XSS issues",
  },

  // Style
  {
    value: "stylistic",
    label: "stylistic",
    package: "@stylistic/eslint-plugin",
    hint: "Formatting and stylistic rules",
  },
  {
    value: "const-case",
    label: "const-case",
    package: "eslint-plugin-const-case",
    hint: "Enforce capitalization of constants",
  },
  {
    value: "editorconfig",
    label: "editorconfig",
    package: "eslint-plugin-editorconfig",
    hint: "Derive rules from .editorconfig",
  },
  {
    value: "simple-import-sort",
    label: "simple-import-sort",
    package: "eslint-plugin-simple-import-sort",
    hint: "Easy import sorting",
  },
  {
    value: "perfectionist",
    label: "perfectionist",
    package: "eslint-plugin-perfectionist",
    hint: "Sort objects, imports, etc.",
  },
  {
    value: "split-and-sort-imports",
    label: "split-and-sort-imports",
    package: "eslint-plugin-split-and-sort-imports",
    hint: "Split and sort imports",
  },
  {
    value: "switch-case",
    label: "switch-case",
    package: "eslint-plugin-switch-case",
    hint: "Switch-case specific rules",
  },
  {
    value: "padding",
    label: "padding",
    package: "eslint-plugin-padding",
    hint: "Padding between statements",
  },
  {
    value: "paths",
    label: "paths",
    package: "eslint-plugin-paths",
    hint: "Use paths from tsconfig/jsconfig",
  },
  {
    value: "no-relative-imports",
    label: "no-relative-imports",
    package: "@gitbutler/no-relative-imports",
    hint: "Auto fix relative paths",
  },

  // Testing Tools
  {
    value: "ava",
    label: "ava",
    package: "eslint-plugin-ava",
    hint: "AVA rules",
  },
  {
    value: "chai-expect",
    label: "chai-expect",
    package: "eslint-plugin-chai-expect",
    hint: "Chai expect practices",
  },
  {
    value: "chai-friendly",
    label: "chai-friendly",
    package: "eslint-plugin-chai-friendly",
    hint: "Chai unused expressions",
  },
  {
    value: "chai-expect-keywords",
    label: "chai-expect-keywords",
    package: "eslint-plugin-chai-expect-keywords",
    hint: "Permitted keywords",
  },
  {
    value: "chai-as-promised",
    label: "chai-as-promised",
    package: "eslint-plugin-chai-as-promised",
    hint: "Chai as promised",
  },
  {
    value: "chai-assert-bdd",
    label: "chai-assert-bdd",
    package: "eslint-plugin-chai-assert-bdd",
    hint: "Chai globals",
  },
  {
    value: "cucumber",
    label: "cucumber",
    package: "eslint-plugin-cucumber",
    hint: "Cucumber rules",
  },
  {
    value: "cypress",
    label: "cypress",
    package: "eslint-plugin-cypress",
    hint: "Cypress rules",
  },
  {
    value: "jasmine",
    label: "jasmine",
    package: "eslint-plugin-jasmine",
    hint: "Jasmine rules",
  },
  {
    value: "jest",
    label: "jest",
    package: "eslint-plugin-jest",
    hint: "Jest practices",
  },
  {
    value: "jest-formatting",
    label: "jest-formatting",
    package: "eslint-plugin-jest-formatting",
    hint: "Jest formatting",
  },
  {
    value: "jest-async",
    label: "jest-async",
    package: "eslint-plugin-jest-async",
    hint: "Jest async rules",
  },
  {
    value: "jest-dom",
    label: "jest-dom",
    package: "eslint-plugin-jest-dom",
    hint: "Jest-DOM rules",
  },
  {
    value: "mocha",
    label: "mocha",
    package: "eslint-plugin-mocha",
    hint: "Mocha practices",
  },
  {
    value: "mocha-cleanup",
    label: "mocha-cleanup",
    package: "eslint-plugin-mocha-cleanup",
    hint: "Mocha cleanup",
  },
  {
    value: "playwright",
    label: "playwright",
    package: "eslint-plugin-playwright",
    hint: "Playwright rules",
  },
  {
    value: "qunit",
    label: "qunit",
    package: "eslint-plugin-qunit",
    hint: "QUnit rules",
  },
  {
    value: "testcafe-community",
    label: "testcafe-community",
    package: "eslint-plugin-testcafe-community",
    hint: "TestCafe rules",
  },
  {
    value: "testing-library",
    label: "testing-library",
    package: "eslint-plugin-testing-library",
    hint: "Testing Library rules",
  },
];

const PRETTIER_PLUGINS: PluginOption[] = [
  // Official
  {
    value: "php",
    label: "php",
    package: "@prettier/plugin-php",
    hint: "Prettier for PHP",
  },
  {
    value: "pug",
    label: "pug",
    package: "@prettier/plugin-pug",
    hint: "Prettier for Pug",
  },
  {
    value: "ruby",
    label: "ruby",
    package: "@prettier/plugin-ruby",
    hint: "Prettier for Ruby",
  },
  {
    value: "xml",
    label: "xml",
    package: "@prettier/plugin-xml",
    hint: "Prettier for XML",
  },

  // Community
  {
    value: "apex",
    label: "apex",
    package: "prettier-plugin-apex",
    hint: "Prettier for Apex",
  },
  {
    value: "astro",
    label: "astro",
    package: "prettier-plugin-astro",
    hint: "Prettier for Astro",
  },
  {
    value: "bigcommerce",
    label: "bigcommerce",
    package: "prettier-plugin-bigcommerce-stencil",
    hint: "Prettier for BigCommerce",
  },
  {
    value: "elm",
    label: "elm",
    package: "prettier-plugin-elm",
    hint: "Prettier for Elm",
  },
  {
    value: "erb",
    label: "erb",
    package: "prettier-plugin-erb",
    hint: "Prettier for ERB",
  },
  {
    value: "gherkin",
    label: "gherkin",
    package: "prettier-plugin-gherkin",
    hint: "Prettier for Gherkin",
  },
  {
    value: "glsl",
    label: "glsl",
    package: "prettier-plugin-glsl",
    hint: "Prettier for GLSL",
  },
  {
    value: "go-template",
    label: "go-template",
    package: "prettier-plugin-go-template",
    hint: "Prettier for Go Templates",
  },
  {
    value: "hugo",
    label: "hugo",
    package: "prettier-plugin-hugo-post",
    hint: "Prettier for Hugo",
  },
  {
    value: "java",
    label: "java",
    package: "prettier-plugin-java",
    hint: "Prettier for Java",
  },
  {
    value: "jinja",
    label: "jinja",
    package: "prettier-plugin-jinja-template",
    hint: "Prettier for Jinja",
  },
  {
    value: "jsonata",
    label: "jsonata",
    package: "prettier-plugin-jsonata",
    hint: "Prettier for JSONata",
  },
  {
    value: "kotlin",
    label: "kotlin",
    package: "prettier-plugin-kotlin",
    hint: "Prettier for Kotlin",
  },
  {
    value: "marko",
    label: "marko",
    package: "prettier-plugin-marko",
    hint: "Prettier for Marko",
  },
  {
    value: "motoko",
    label: "motoko",
    package: "prettier-plugin-motoko",
    hint: "Prettier for Motoko",
  },
  {
    value: "nginx",
    label: "nginx",
    package: "prettier-plugin-nginx",
    hint: "Prettier for Nginx",
  },
  {
    value: "prisma",
    label: "prisma",
    package: "prettier-plugin-prisma",
    hint: "Prettier for Prisma",
  },
  {
    value: "properties",
    label: "properties",
    package: "prettier-plugin-properties",
    hint: "Prettier for Properties",
  },
  {
    value: "rust",
    label: "rust",
    package: "prettier-plugin-rust",
    hint: "Prettier for Rust",
  },
  {
    value: "sh",
    label: "sh",
    package: "prettier-plugin-sh",
    hint: "Prettier for Shell",
  },
  {
    value: "sql",
    label: "sql",
    package: "prettier-plugin-sql",
    hint: "Prettier for SQL",
  },
  {
    value: "sql-cst",
    label: "sql-cst",
    package: "prettier-plugin-sql-cst",
    hint: "Prettier for SQL (CST)",
  },
  {
    value: "solidity",
    label: "solidity",
    package: "prettier-plugin-solidity",
    hint: "Prettier for Solidity",
  },
  {
    value: "svelte",
    label: "svelte",
    package: "prettier-plugin-svelte",
    hint: "Prettier for Svelte",
  },
  {
    value: "toml",
    label: "toml",
    package: "prettier-plugin-toml",
    hint: "Prettier for TOML",
  },
  {
    value: "xquery",
    label: "xquery",
    package: "prettier-plugin-xquery",
    hint: "Prettier for XQuery",
  },

  // Existing
  {
    value: "tailwindcss",
    label: "tailwindcss",
    package: "prettier-plugin-tailwindcss",
    hint: "Prettier for Tailwind CSS",
  },
  {
    value: "organize-imports",
    label: "organize-imports",
    package: "prettier-plugin-organize-imports",
    hint: "Organize imports",
  },
  {
    value: "sort-imports",
    label: "sort-imports",
    package: "@trivago/prettier-plugin-sort-imports",
    hint: "Sort imports",
  },
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
