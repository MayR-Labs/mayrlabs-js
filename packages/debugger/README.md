# @mayrlabs/debugger

A lightweight, environment-aware debugging utility for TypeScript applications. It provides structured logging with timestamps, log levels, color-coded output (in supported environments), and execution timing capabilities.

## Features

- **Environment Awareness**: Helper methods to log only in development environments. Checks `NODE_ENV` and `import.meta.env.DEV`.
- **Log Levels**: Support for `log`, `info`, `warn`, `error`, and `debug`.
- **Custom Colors**: Support for custom hex colors using `.custom()`.
- **Namespaces**: Support for organizing logs with namespaces.
- **Timestamps**: Automatically adds timestamps to all log messages.
- **Color Coding**: Visual distinction between log levels in browser consoles.
- **Execution Timing**: `timeBox` utility to measure and log the duration of async operations.
- **TypeScript Support**: Built with TypeScript for full type safety.

## Installation

```bash
npm install @mayrlabs/debugger
# or
yarn add @mayrlabs/debugger
# or
pnpm add @mayrlabs/debugger
```

## Usage

### Basic Logging

Import the `debug` function and use it to create a logger instance on the fly.

```typescript
import { debug } from "@mayrlabs/debugger";

// Simple logging
debug().log("Hello, world!");

// Information
debug().info("System initialized");

// Warnings
debug().warn("Resource usage is high");

// Errors
debug().error("Connection failed", { code: 500 });
```

### Development Only Mode

Use the `.devOnly()` modifier to suppress logs in production environments. This checks:

1. `process.env.NODE_ENV !== 'production'`
2. `import.meta.env.DEV` (for Vite/ESM environments)

```typescript
import { debug } from "@mayrlabs/debugger";

// This will be silenced in production
debug().devOnly().log("This is a debug message");
```

### Measuring Execution Time

Use `timeBox` to measure how long an asynchronous operation takes.

```typescript
import { debug } from "@mayrlabs/debugger";

async function fetchData() {
  const data = await debug().timeBox("Fetching user data", async () => {
    const response = await fetch("/api/user");
    return response.json();
  });

  return data;
}
// Console output: "Fetching user data took 123.456ms"
```

## API Reference

### `debug(namespace?: string)`

Factory function that returns a new `Debugger` instance. Optional `namespace` argument prefixes all logs.

### `Debugger` Methods

- **`log(...args: unknown[])`**: Standard log message.
- **`info(...args: unknown[])`**: Informational message (Green).
- **`warn(...args: unknown[])`**: Warning message (Yellow/Orange).
- **`error(...args: unknown[])`**: Error message (Red).
- **`debug(...args: unknown[])`**: Debug message (Purple).
- **`custom(color: string, ...args: unknown[])`**: Log with a custom hex color.
- **`devOnly()`**: Returns the debugger instance but sets it to only log if environment is not production.
- **`timeBox<T>(label: string, fn: () => Promise<T> | T): Promise<T>`**: Executes the provided function, logs specific duration, and returns the result.

## License

MIT
