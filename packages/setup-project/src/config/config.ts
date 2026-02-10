import { ProjectConfig, Tool } from "./types";
import pc from "picocolors";

export class Config {
  public data: ProjectConfig;

  constructor() {
    this.data = {
      husky: { selected: false },
      formatter: { selected: false },
      linter: { selected: false },
      lintStaged: { selected: false },
      env: { selected: false },
      test: { selected: false },
      editorConfig: { selected: false },
      license: {
        selected: false,
        config: { name: "", email: "", website: "", type: "MIT" },
      },
    };
  }

  get<T extends Tool>(tool: T): ProjectConfig[T] {
    return this.data[tool];
  }

  enableTool(tool: Tool) {
    this.data[tool].selected = true;
  }

  get summary(): string {
    const lines: string[] = [];
    lines.push(pc.bold("The following actions will be performed:"));
    lines.push("");

    if (this.data.husky.selected) {
      lines.push(pc.magenta(`• Install and configure Husky`));
      if (this.data.husky.config?.hookType === "custom") {
        lines.push(pc.dim(`  - Custom hook script`));
      }
    }

    if (this.data.formatter.selected) {
      const choice = this.data.formatter.config?.choice;
      lines.push(pc.blue(`• Install and configure ${choice || "Formatter"}`));
    }

    if (this.data.linter.selected) {
      const choice = this.data.linter.config?.choice;
      lines.push(pc.yellow(`• Install and configure ${choice || "Linter"}`));
    }

    if (this.data.lintStaged.selected) {
      lines.push(pc.green(`• Install and configure Lint-staged`));
      const lintExts = this.data.lintStaged.config?.lintExtensions?.join(", ");
      const formatExts =
        this.data.lintStaged.config?.formatExtensions?.join(", ");
      if (lintExts) lines.push(pc.dim(`  - Lint: ${lintExts}`));
      if (formatExts) lines.push(pc.dim(`  - Format: ${formatExts}`));
    }

    if (this.data.env.selected) {
      lines.push(pc.cyan(`• Install and configure Env Validation`));
      lines.push(pc.dim(`  - Variant: ${this.data.env.config?.variant}`));
      lines.push(pc.dim(`  - Validator: ${this.data.env.config?.validator}`));
    }

    if (this.data.test.selected) {
      const runner = this.data.test.config?.runner;
      lines.push(pc.red(`• Install and configure Test Runner (${runner})`));
    }

    if (this.data.editorConfig.selected) {
      const preset = this.data.editorConfig.config?.preset;
      lines.push(pc.white(`• Create .editorconfig (${preset})`));
    }

    if (this.data.license.selected) {
      const type = this.data.license.config?.type;
      const name = this.data.license.config?.name;
      lines.push(pc.green(`• Create LICENSE (${type})`));
      lines.push(pc.dim(`  - Holder: ${name}`));
    }

    return lines.join("\n");
  }
}

export const config = new Config();
