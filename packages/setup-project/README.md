# @mayrlabs/setup-project

Interactive CLI to verify and configure common project tools for modern JavaScript/TypeScript applications.

## Features

- 🐶 **Husky**: Set up git hooks effortlessly.
- 💅 **Formatter**: Choose between **Prettier** or **Oxfmt**.
- 🧹 **Linter**: Choose between **ESLint** or **Oxlint**.
- 🚫 **Lint-staged**: Automatically lint/format staged files with broad extension support.
- 🌳 **Env Validation**: Set up **@t3-oss/env** for Next.js, Nuxt, or Core, with optional presets.
- 🧪 **Testing**: Configure **Vitest** or **Jest**.
- ⚙️ **EditorConfig**: Generate standardized `.editorconfig` files.
- 📄 **License**: Generate MIT, ISC, or Apache-2.0 licenses.
- 🛡️ **Git Safety**: Checks for uncommitted changes before making modifications.

## Usage

Run the following command in your project directory:

```bash
npx @mayrlabs/setup-project@latest
```

The CLI will guide you through an interactive survey to select the tools you want to configure. No changes are made until you confirm the summary at the end.

## How it works

1. **Git Check**: Ensures your working directory is clean (or offers to commit changes).
2. **Survey**: Asks you which tools you want to set up and collects your preferences.
3. **Summary**: Shows a summary of the actions to be taken.
4. **Execution**: Installs dependencies and creates configuration files tailored to your choices.

## License

MIT © [MayR Labs](https://mayrlabs.com)
