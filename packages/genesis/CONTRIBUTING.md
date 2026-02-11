# Contributing to @mayrlabs/genesis

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to this package. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Development Setup

### Directory Structure

This project follows a **Feature-based Architecture**. It is designed to be modular and easy to extend.

- **`src/features/`**: This is where the magic happens. Each tool (e.g., `husky`, `prettier`, `eslint`) has its own directory here.
  - `install.ts`: Logic for installing dependencies and writing config files.
  - `prompt.ts`: Logic for prompting the user for configuration options.
  - `config.ts`: Default configuration values.
- **`src/core/`**: Core application logic.
  - `config.ts`: The central `Config` class that holds the state of the user's choices.
  - `types.ts`: Shared TypeScript interfaces.
- **`src/cli/`**: CLI specific code.
  - `index.ts`: The entry point.
  - `commands/`: Handlers for specific commands like `configure`.
- **`src/utils/`**: Shared helper functions (Package Manager detection, Git checks, etc.).

### Prerequisites

- Node.js (v18 or higher)
- npm, pnpm, yarn, or bun

### Local Installation

1. **Fork and Clone** the repository.
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project** to ensure everything is linked correctly:

   ```bash
   npm run build
   ```

### Running Locally

You can run the CLI against the local source code using the `demo` script:

```bash
npm run demo
```

Or you can build and run the distribution version:

```bash
node dist/index.js
```

## Running Tests

We use **Vitest** for testing. We aim for high test coverage to ensure stability.

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

### Writing Tests

- **Unit Tests**: Colocated with source code or in `tests/`.
- **Mocks**: We heavily mock `@clack/prompts`, `execa`, and `fs-extra` to avoid actual side effects during testing. Ensure you mock these when writing feature tests.

## Adding a New Feature

Want to add support for a new tool (e.g., "XYZ")?

1. Create a new folder `src/features/xyz/`.
2. Implement `promptXyz` (in `prompt.ts`) and `installXyz` (in `install.ts`).
3. Add the tools configuration to the `Config` class in `src/core/config.ts`.
4. Update `src/steps/execution.ts` to include the new installer.
5. Add unit tests for your new feature.

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`npm test`).
5. Open that PR!

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
