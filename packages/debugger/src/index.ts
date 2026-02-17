export class Debugger {
  private isDevOnly: boolean = false;

  public devOnly() {
    this.isDevOnly = true;
    return this;
  }

  private shouldLog(): boolean {
    if (this.isDevOnly) return process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

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
    // @ts-ignore
    if (typeof window === "undefined") {
      return [`[${this.getTimestamp()}] [${level}]`, ...message];
    }

    return [
      `%c ${level} %c [${this.getTimestamp()}]`,
      `background: ${color}; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;`,
      "color: gray; font-size: 0.8em;",
      ...message,
    ];
  }

  public log(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(...this.formatMessage("LOG", args, "#3b82f6"));
  }

  // Alias for debug -> logs with a different color/level
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
 * usage: debug().log('message') or debug().devOnly().log('message')
 * Note: Named 'debug' because 'debugger' is a reserved keyword.
 */
export const debug = () => new Debugger();
