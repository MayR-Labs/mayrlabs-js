import { confirm, question, select, multiselect } from "@topcli/prompts";
import pc from "picocolors";
import { PromptOption, PromptProvider } from "./types";

const CANCEL_SYMBOL = Symbol("cancel");

export class TopCliProvider implements PromptProvider {
  intro(message: string): void {
    console.log(pc.bgCyan(pc.black(` ${message} `)));
  }

  outro(message: string): void {
    console.log(pc.bgCyan(pc.black(` ${message} `)));
  }

  async text(opts: {
    message: string;
    placeholder?: string;
    initialValue?: string;
    defaultValue?: string;
    validate?: (value: string) => string | void;
  }): Promise<string | symbol> {
    try {
      return await question(opts.message, {
        defaultValue: opts.initialValue || opts.defaultValue,
        validators: [
          {
            validate: (value) => opts.validate?.(value) || null,
          },
        ],
      });
    } catch {
      return CANCEL_SYMBOL;
    }
  }

  async confirm(opts: {
    message: string;
    initialValue?: boolean;
  }): Promise<boolean | symbol> {
    try {
      return await confirm(opts.message, {
        initial: opts.initialValue,
      });
    } catch {
      return CANCEL_SYMBOL;
    }
  }

  async select<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T;
  }): Promise<T | symbol> {
    try {
      const optionMap = new Map<string, T>();

      const choices = opts.options.map((o) => {
        const key = String(o.value);

        optionMap.set(key, o.value);

        const isSelected = opts.initialValue === o.value;

        return {
          label: o.label,
          value: key,
          description: o.hint,
          selected: isSelected,
        };
      });

      const resultKey = await select(opts.message, {
        choices,
        autocomplete: true,
        maxVisible: 10,
      });

      return optionMap.get(resultKey) as T;
    } catch {
      return CANCEL_SYMBOL;
    }
  }

  async multiselect<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T[];
    required?: boolean;
  }): Promise<T[] | symbol> {
    try {
      const optionMap = new Map<string, T>();

      const choices = opts.options.map((o) => {
        const key = String(o.value);

        optionMap.set(key, o.value);

        const isSelected = opts.initialValue?.some((iv) => iv === o.value);

        return {
          label: o.label,
          value: key,
          description: o.hint,
          selected: isSelected,
        };
      });

      const resultKeys = await multiselect(opts.message, {
        choices,
        autocomplete: true,
        maxVisible: 10,
        showHint: true,
      });

      return resultKeys.map((k) => optionMap.get(k) as T);
    } catch {
      return CANCEL_SYMBOL;
    }
  }

  note(message: string, title?: string): void {
    if (title) {
      console.log(pc.blue(pc.bold(`${title}`)));
    }
    console.log(pc.dim(message));
  }

  isCancel(value: unknown): boolean {
    return value === CANCEL_SYMBOL;
  }

  cancel(message?: string): void {
    if (message) console.log(pc.red(pc.bold("×")) + " " + message);
    else console.log(pc.red(pc.bold("×")) + " Operation cancelled.");
  }

  log = {
    message: (msg: string) => console.log(msg),
    info: (msg: string) => console.log(pc.blue(pc.bold("INFO")) + " " + msg),
    success: (msg: string) =>
      console.log(pc.green(pc.bold("SUCCESS")) + " " + msg),
    warn: (msg: string) => console.log(pc.yellow(pc.bold("WARN")) + " " + msg),
    error: (msg: string) => console.log(pc.red(pc.bold("ERROR")) + " " + msg),
  };
}
