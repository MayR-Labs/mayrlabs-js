import { intro, outro, select } from "@clack/prompts";
import pc from "picocolors";
import { config } from "@/config/config";
import { Tool } from "@/config/types";
import { TOOL_OPTIONS } from "@/constants/options";
import { promptHusky, installHusky } from "@/services/husky";
import { promptFormatter, installFormatter } from "@/services/formatter";
import { promptLinter, installLinter } from "@/services/linter";
import { promptLintStaged, installLintStaged } from "@/services/lint-staged";
import { promptEnv, installEnv } from "@/services/env";
import { promptTest, installTest } from "@/services/test";
import {
  promptEditorConfig,
  installEditorConfig,
} from "@/services/editor-config";
import { promptLicense, installLicense } from "@/services/license";
import { withCancelHandling } from "@/utils/handle-cancel";
import { introScreen } from "@/utils/display";

export async function configure(toolName?: string) {
  introScreen();

  intro(pc.inverse(pc.bold(pc.blue(" Configuration Mode "))));

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
      select({
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
    outro(pc.green(`${selectedTool} configured successfully!`));
  } catch (error) {
    outro(pc.red(`Failed to configure ${selectedTool}.`));
    console.error(error);
    process.exit(1);
  }
}
