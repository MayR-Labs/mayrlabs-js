import {
  intro,
  outro,
  text,
  confirm,
  select,
  multiselect,
  note,
  isCancel,
  cancel,
  log,
} from "@clack/prompts";
import { PromptOption, PromptProvider } from "./types";

export class ClackProvider implements PromptProvider {
  intro(message: string): void {
    intro(message);
  }

  outro(message: string): void {
    outro(message);
  }

  async text(opts: {
    message: string;
    placeholder?: string;
    initialValue?: string;
    defaultValue?: string;
    validate?: (value: string) => string | void;
  }): Promise<string | symbol> {
    return text(opts) as Promise<string | symbol>;
  }

  async confirm(opts: {
    message: string;
    initialValue?: boolean;
  }): Promise<boolean | symbol> {
    return confirm(opts) as Promise<boolean | symbol>;
  }

  async select<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T;
  }): Promise<T | symbol> {
    return select({
      message: opts.message,
      options: opts.options.map((o) => ({
        label: o.label,
        value: o.value,
        hint: o.hint,
      })),
    }) as Promise<T | symbol>;
  }

  async multiselect<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T[];
    required?: boolean;
  }): Promise<T[] | symbol> {
    return multiselect({
      message: opts.message,
      options: opts.options.map((o) => ({
        label: o.label,
        value: o.value,
        hint: o.hint,
      })),
    }) as Promise<T[] | symbol>;
  }

  note(message: string, title?: string): void {
    note(message, title);
  }

  isCancel(value: unknown): boolean {
    return isCancel(value);
  }

  cancel(message?: string): void {
    cancel(message);
  }

  log = {
    message: (msg: string) => log.message(msg),
    info: (msg: string) => log.info(msg),
    success: (msg: string) => log.success(msg),
    warn: (msg: string) => log.warn(msg),
    error: (msg: string) => log.error(msg),
  };
}
