# @mayrlabs/setup-project

An interactive CLI tool to quickly scaffold and configure common development tools for your projects.

## Features

- **Interactive UI**: Uses `@clack/prompts` for a beautiful terminal experience.
- **Tool Selection**: Multi-select support for:
  - Husky (Git hooks)
  - Prettier or Oxfmt (Formatter)
  - ESLint or Oxlint (Linter)
  - Lint-staged
  - @t3-oss/env (Environment validation)
- **Smart Configuration**:
  - Automatically installs dependencies.
  - Creates configuration files (`.prettierrc`, `.eslintrc.json`, `.lintstagedrc`, etc.).
  - Sets up `pre-commit` hooks.
  - Generates typesafe environment validation files (`env.ts` or `env/server.ts` + `env/client.ts`).

## Usage

Run the following command in your project root:

```bash
npx @mayrlabs/setup-project@latest
```

Follow the interactive prompts to select the tools you need.

> [!WARNING]
> This tool modifies configuration files. It is recommended to use it on a fresh project or commit your changes before running it.

## Configuration Details

### Husky

- Initializes Husky.
- Options to set up `lint-staged` or a custom script as a pre-commit hook.

### Formatter

- Choose between **Prettier** and **Oxfmt**.
- Generates standard configuration.

### Linter

- Choose between **ESLint** and **Oxlint**.
- Generates standard configuration.

### Lint-staged

- configure linting for js, ts, jsx, tsx.
- configure formatting for md, css, json.
- Automatically uses the selected linter and formatter.

### Env Validation

- Supports Next.js, Nuxt, and Core variants.
- Choose validator: Zod, Valibot, or Arktype.
- Install presets for common platforms (Vercel, Railway, etc.).
- Generate split (`env/client.ts`, `env/server.ts`) or joined (`env.ts`) files.

## License

MIT
