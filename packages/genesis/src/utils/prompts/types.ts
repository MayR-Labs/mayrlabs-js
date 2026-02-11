export type PromptOption<T> = {
  value: T;
  label: string;
  hint?: string;
};

export interface PromptLogger {
  message(msg: string): void;
  info(msg: string): void;
  success(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export interface PromptProvider {
  /** Display an intro message */
  intro(message: string): void;

  /** Display an outro message */
  outro(message: string): void;

  /** Prompt for text input */
  text(opts: {
    message: string;
    placeholder?: string;
    initialValue?: string;
    defaultValue?: string;
    validate?: (value: string) => string | void;
  }): Promise<string | symbol>;

  /** Prompt for confirmation (boolean) */
  confirm(opts: {
    message: string;
    initialValue?: boolean;
  }): Promise<boolean | symbol>;

  /** Prompt for single selection */
  select<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T;
  }): Promise<T | symbol>;

  /** Prompt for multi-selection */
  multiselect<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T[];
    required?: boolean;
  }): Promise<T[] | symbol>;

  /** Display a note/info block */
  note(message: string, title?: string): void;

  /** Check if the value indicates cancellation (usually a symbol) */
  isCancel(value: unknown): boolean;

  /** Handle cancellation (log message and potentially exit process) */
  cancel(message?: string): void;

  /** Logger utilities */
  log: PromptLogger;
}
