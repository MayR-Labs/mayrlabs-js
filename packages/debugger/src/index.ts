/**
 * A lightweight, environment-aware debugging utility.
 * Provides structured logging with timestamps, log levels, and execution timing.
 */
export class Debugger {
  private namespace?: string;
  private isDevOnly: boolean = false;

  /**
   * Creates a new Debugger instance.
   * @param namespace Optional namespace to prefix all logs with.
   */
  constructor(namespace?: string) {
    this.namespace = namespace;
  }

  /**
   * Restricts logging to development environments only.
   * Checks `NODE_ENV !== 'production'` and `import.meta.env.DEV`.
   * @returns The Debugger instance for chaining.
   */
  public devOnly() {
    this.isDevOnly = true;
    return this;
  }

  private shouldLog(): boolean {
    if (this.isDevOnly) {
      if (typeof process !== "undefined" && process.env.NODE_ENV) {
        return process.env.NODE_ENV !== "production";
      }

      // Check for import.meta.env.DEV if available (Vite/ESM)
      try {
        // @ts-ignore
        if (import.meta && import.meta.env && import.meta.env.DEV) return true;
      } catch {}

      return false;
    }

    return true;
  }

  private getTimestamp() {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  }

  private formatMessage(level: string, message: unknown[], color: string) {
    const prefix = this.namespace ? ` [${this.namespace}]` : "";

    // @ts-ignore
    if (typeof window === "undefined") {
      return [`[${this.getTimestamp()}]${prefix} [${level}]`, ...message];
    }

    return [
      `%c ${level} %c [${this.getTimestamp()}]${prefix}`,
      `background: ${color}; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;`,
      "color: gray; font-size: 0.8em;",
      ...message,
    ];
  }

  /**
   * Logs a message with a custom hex color.
   * @param color Hex color code (e.g., '#ff0000').
   * @param args Arguments to log.
   */
  public custom(color: string, ...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(...this.formatMessage("CUSTOM", args, color));
  }

  /**
   * Logs a standard message with a blue label.
   * @param args Arguments to log.
   */
  public log(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(...this.formatMessage("LOG", args, "#3b82f6"));
  }

  /**
   * Logs a debug message with a purple label.
   * @param args Arguments to log.
   */
  public debug(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.debug(...this.formatMessage("DEBUG", args, "#8b5cf6"));
  }

  /**
   * Logs a warning message with an orange label.
   * @param args Arguments to log.
   */
  public warn(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.warn(...this.formatMessage("WARN", args, "#f59e0b"));
  }

  /**
   * Logs an error message with a red label.
   * @param args Arguments to log.
   */
  public error(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.error(...this.formatMessage("ERROR", args, "#ef4444"));
  }

  /**
   * Logs an informational message with a green label.
   * @param args Arguments to log.
   */
  public info(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.info(...this.formatMessage("INFO", args, "#10b981"));
  }

  /**
   * Measures the execution time of a synchronous or asynchronous function.
   * Logs the duration with the provided label.
   * @param label The label for the timing log.
   * @param fn The function to execute.
   * @returns The result of the function execution.
   */
  public async timeBox<T>(label: string, fn: () => Promise<T> | T): Promise<T> {
    if (!this.shouldLog()) return fn();

    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      const duration = (end - start).toFixed(3);
      this.log(`${label} took ${duration}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = (end - start).toFixed(3);
      this.error(`${label} failed after ${duration}ms`, error);
      throw error;
    }
  }
}

/**
 * Creates a new Debugger instance.
 * usage: debug().log('message') or debug('MyModule').devOnly().log('message')
 */
export const debug = (namespace?: string) => new Debugger(namespace);
