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

### Recommended Pattern

It is recommended to create and export specific debugger instances for your application modules.

```typescript
// lib/debugger.ts
import { Debugger } from "@mayrlabs/debugger";

// Create named instances for different parts of your app
export const authDebugger = new Debugger("Auth").devOnly();
export const dbDebugger = new Debugger("Database");
export const appDebugger = new Debugger("App");
```

```typescript
// Usage in other files
import { authDebugger } from "./lib/debugger";

authDebugger.log("User logged in");
```

### Basic Usage

You can also instantiate the `Debugger` class directly where needed.

```typescript
import { Debugger } from "@mayrlabs/debugger";

const logger = new Debugger();

// Simple logging
logger.log("Hello, world!");

// Information
logger.info("System initialized");

// Warnings
logger.warn("Resource usage is high");

// Errors
logger.error("Connection failed", { code: 500 });
```

### Alternative Usage (Factory Function)

You can use the `debug` factory function for a more functional approach.

```typescript
import { debug } from "@mayrlabs/debugger";

// Quick one-off logging
debug().log("Hello, world!");

// With namespace
debug("Auth").log("User logged in");

// With devOnly
debug().devOnly().log("This will only log in development");
```

### Development Only Mode

Use the `.devOnly()` modifier to suppress logs in production environments. This checks:

1. `process.env.NODE_ENV !== 'production'`
2. `import.meta.env.DEV` (for Vite/ESM environments)

```typescript
import { Debugger } from "@mayrlabs/debugger";

// This will be silenced in production
new Debugger().devOnly().log("This is a debug message");
```

### Measuring Execution Time

Use `timeBox` to measure how long an asynchronous operation takes.

```typescript
import { Debugger } from "@mayrlabs/debugger";

async function fetchData() {
  const logger = new Debugger();
  const data = await logger.timeBox("Fetching user data", async () => {
    const response = await fetch("/api/user");
    return response.json();
  });

  return data;
}
// Console output: "Fetching user data took 123.456ms"
```

### Namespaces

You can categorize your logs by providing a namespace string to the `Debugger` constructor.

```typescript
import { Debugger } from "@mayrlabs/debugger";

const authLogger = new Debugger("Auth");
const dbLogger = new Debugger("Database");

authLogger.log("User logged in");
// Output: [Timestamp] [Auth] [LOG] User logged in

dbLogger.error("Connection failed");
// Output: [Timestamp] [Database] [ERROR] Connection failed
```

### Custom Colors

Use the `.custom()` method to log with a specific hex color.

```typescript
import { Debugger } from "@mayrlabs/debugger";

new Debugger().custom("#FF00FF", "This is a magenta message");
```

## API Reference

### `new Debugger(namespace?: string)`

Creates a new `Debugger` instance. Optional `namespace` argument prefixes all logs.

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
