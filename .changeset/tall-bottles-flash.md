---
"@mayrlabs/debugger": major
---

Initial release of `@mayrlabs/debugger`, a lightweight, environment-aware debugging utility for TypeScript applications.

Features:

- **Environment Awareness**: Helper methods to log only in development environments (`NODE_ENV` or `import.meta.env`).
- **Log Levels**: Support for `log`, `info`, `warn`, `error`, and `debug`.
- **Custom Colors**: Support for custom hex colors using `.custom()`.
- **Namespaces**: Support for organizing logs with namespaces.
- **Execution Timing**: `timeBox` utility to measure and log the duration of async operations.
