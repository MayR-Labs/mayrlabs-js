class Debugger {
  private namespace?: string;
  private isDevOnly: boolean = false;

  constructor(namespace?: string) {
    this.namespace = namespace;
  }

  public devOnly() {
    this.isDevOnly = true;
    return this;
  }

  private shouldLog(): boolean {
    if (this.isDevOnly) {
      if (typeof process !== "undefined" && process.env.NODE_ENV) {
        return process.env.NODE_ENV !== "production";
      }
      // @ts-ignore
      // Check for import.meta.env.DEV if available (Vite/ESM)
      try {
        // @ts-ignore
        if (import.meta && import.meta.env && import.meta.env.DEV) {
          return true;
        }
      } catch {
        // Ignore errors if import.meta is not defined
      }

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

  public custom(color: string, ...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(...this.formatMessage("CUSTOM", args, color));
  }

  public log(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(...this.formatMessage("LOG", args, "#3b82f6"));
  }

  public debug(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.debug(...this.formatMessage("DEBUG", args, "#8b5cf6"));
  }

  public warn(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.warn(...this.formatMessage("WARN", args, "#f59e0b"));
  }

  public error(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.error(...this.formatMessage("ERROR", args, "#ef4444"));
  }

  public info(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.info(...this.formatMessage("INFO", args, "#10b981"));
  }

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
 * Note: Named 'debug' because 'debugger' is a reserved keyword.
 */
export const debug = (namespace?: string) => new Debugger(namespace);
