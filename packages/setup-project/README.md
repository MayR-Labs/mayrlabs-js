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

## Development

### Directory Structure

The project follows a feature-based architecture:

- `src/features/`: Contains logic for each tool (e.g., `husky`, `prettier`).
- `src/core/`: Core application logic and configuration management.
- `src/cli/`: CLI entry point and command handlers.
- `src/utils/`: Shared utilities.

### Running Tests

This project uses **Vitest** for testing.

```bash
npm test
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Run tests (`npm test`).
5. Commit your changes (`git commit -m 'Add some feature'`).
6. Push to the branch (`git push origin feature/my-feature`).
7. Open a Pull Request.

## License

MIT © [MayR Labs](https://mayrlabs.com)
