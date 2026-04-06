import pc from "picocolors";
import { TOOL_OPTIONS } from "@/constants/options";
import { config } from "@/core/config";
import type { Tool } from "@/core/types";
import {
  installEditorConfig,
  promptEditorConfig,
} from "@/features/editor-config";
import { installEnv, promptEnv } from "@/features/env";
import { installFormatter, promptFormatter } from "@/features/formatter";
import { installHusky, promptHusky } from "@/features/husky";
import { installLicense, promptLicense } from "@/features/license";
import { installLintStaged, promptLintStaged } from "@/features/lint-staged";
import { installLinter, promptLinter } from "@/features/linter";
import { installTest, promptTest } from "@/features/test";
import gitCheck from "@/steps/git-check";
import { introScreen } from "@/utils/display";
import { withCancelHandling } from "@/utils/handle-cancel";
import { prompts } from "@/utils/prompts";

export async function configure(toolName?: string) {
  introScreen();

  prompts.intro(pc.inverse(pc.bold(pc.blue(" Configuration Mode "))));

  await gitCheck();

  let selectedTool: Tool | undefined;

  if (toolName) {
    const tool = TOOL_OPTIONS.find((t) => t.value === toolName);

    if (tool) {
      selectedTool = tool.value as Tool;
    } else {
      console.log(
        pc.yellow(`Tool '${toolName}' not found or not configurable.`),
      );
    }
  }

  if (!selectedTool) {
    const selection = (await withCancelHandling(async () =>
      prompts.select({
        message: "Select a tool to configure:",
        options: TOOL_OPTIONS,
      }),
    )) as string as Tool;

    selectedTool = selection;
  }

  config.enableTool(selectedTool);

  try {
    switch (selectedTool) {
      case "husky":
        await promptHusky(config);
        await installHusky(config);
        break;
      case "formatter":
        await promptFormatter(config);
        await installFormatter(config);
        break;
      case "linter":
        await promptLinter(config);
        await installLinter(config);
        break;
      case "lintStaged":
        await promptLintStaged(config);
        await installLintStaged(config);
        break;
      case "env":
        await promptEnv(config);
        await installEnv(config);
        break;
      case "test":
        await promptTest(config);
        await installTest(config);
        break;
      case "editorConfig":
        await promptEditorConfig(config);
        await installEditorConfig(config);
        break;
      case "license":
        await promptLicense(config);
        await installLicense(config);
        break;
    }
    prompts.outro(pc.green(`${selectedTool} configured successfully!`));
  } catch (error) {
    prompts.outro(pc.red(`Failed to configure ${selectedTool}.`));
    console.error(error);
    process.exit(1);
  }
}
