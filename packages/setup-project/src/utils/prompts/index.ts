import { ClackProvider } from "./clack";
import { TopCliProvider } from "./top";
import { PromptProvider, PromptOption, PromptLogger } from "./types";

export class Prompts implements PromptProvider {
  private provider: PromptProvider;
  private static instance: Prompts;

  private constructor() {
    this.provider = new TopCliProvider();
  }

  static getInstance(): Prompts {
    if (!Prompts.instance) {
      Prompts.instance = new Prompts();
    }
    return Prompts.instance;
  }

  setProvider(provider: PromptProvider) {
    this.provider = provider;
  }

  useClack() {
    this.provider = new ClackProvider();
  }

  useTopCli() {
    this.provider = new TopCliProvider();
  }

  intro(message: string): void {
    this.provider.intro(message);
  }

  outro(message: string): void {
    this.provider.outro(message);
  }

  text(opts: Parameters<PromptProvider["text"]>[0]): Promise<string | symbol> {
    return this.provider.text(opts);
  }

  confirm(
    opts: Parameters<PromptProvider["confirm"]>[0]
  ): Promise<boolean | symbol> {
    return this.provider.confirm(opts);
  }

  select<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T;
  }): Promise<T | symbol> {
    return this.provider.select(opts);
  }

  multiselect<T>(opts: {
    message: string;
    options: PromptOption<T>[];
    initialValue?: T[];
    required?: boolean;
  }): Promise<T[] | symbol> {
    return this.provider.multiselect(opts);
  }

  note(message: string, title?: string): void {
    this.provider.note(message, title);
  }

  isCancel(value: unknown): boolean {
    return this.provider.isCancel(value);
  }

  cancel(message?: string): void {
    this.provider.cancel(message);
  }

  get log(): PromptLogger {
    return this.provider.log;
  }
}

export const prompts = Prompts.getInstance();

export { PromptProvider, PromptOption, PromptLogger };
