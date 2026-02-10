# @mayrlabs/setup-project

**Interactive CLI to fast-track your project setup.**

🚀 **Spin up a production-ready environment in seconds.**

Starting a new project often involves hours of repetitive configuration: setting up linting, formatting, git hooks, testing frameworks, and more. `@mayrlabs/setup-project` automates this entirely.

Instead of copy-pasting `.eslintrc` files or manually installing dependencies, just run one command and let our interactive CLI handle the rest.

## Why use this?

- **Zero Config Fatigue**: No more wrestling with disparate config files. We provide sensible, battle-tested defaults.
- **Modern Stack Support**: Best-in-class support for the tools you actually use: Prettier, ESLint, Husky, Vitest, and more.
- **Interactive & Safe**: The CLI iterates with you. Pick exactly what you need. It even checks for a clean git state before making changes.
- **Extensible**: Need to add a Tailwind plugin to Prettier? We got you. The `plugin` command makes extending your tools a breeze.

## Quick Start

Run the CLI in your project root:

```bash
npx @mayrlabs/setup-project@latest
```

Follow the prompts to select your tools. That's it!

## What's Inside?

We support configuration for the following tools:

| Feature | Description |
| :--- | :--- |
| 🐶 **Husky** | Robust git hooks to ensure quality before commits. |
| 💅 **Formatter** | **Prettier** or **Biome** (coming soon) for consistent code style. |
| 🧹 **Linter** | **ESLint** configured with modern best practices. |
| 🚫 **Lint-staged** | Run linters/formatters only on changed files. Fast. |
| 🌳 **Env Validation** | Type-safe environment variables with **@t3-oss/env**. |
| 🧪 **Testing** | Ready-to-go **Vitest** configuration. |
| ⚙️ **EditorConfig** | Consistent coding styles between different editors. |
| 📄 **License** | Generate standard MIT, Apache, or ISC licenses instantly. |

## Advanced Usage

### Manage Plugins

Want to add plugins to your existing tools?

```bash
npx @mayrlabs/setup-project plugin
```

This will guide you through adding plugins to ESLint or Prettier (e.g., `prettier-plugin-tailwindcss`).

### Configure Single Tool

Just need to set up one thing?

```bash
npx @mayrlabs/setup-project configure husky
```

## Contributing

We love contributions! If you're looking to help improve this package (add new tools, fix bugs), please check out our [Contributing Guide](./CONTRIBUTING.md).

## License

MIT © [MayR Labs](https://mayrlabs.com)
