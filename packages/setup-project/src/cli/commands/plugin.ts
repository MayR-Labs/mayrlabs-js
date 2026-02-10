import { prompts } from "@/utils/prompts";
import pc from "picocolors";
import { PluginableToolType } from "@/constants/plugins";
import { withCancelHandling } from "@/utils/handle-cancel";
import { introScreen } from "@/utils/display";
import gitCheck from "@/steps/git-check";
import { Option } from "@/constants/options";
import { installPlugins } from "@/steps/install-plugin";

export async function plugin(toolName?: PluginableToolType) {
  introScreen();

  prompts.intro(pc.inverse(pc.bold(pc.magenta(" Plugin Manager "))));

  await gitCheck();

  if (!toolName) {
    toolName = (await withCancelHandling(async () =>
      prompts.select({
        message: "Select a tool to add plugins to:",
        options: [
          { value: "eslint", label: "ESLint" },
          { value: "prettier", label: "Prettier" },
        ] satisfies Option<PluginableToolType>[],
      })
    )) as PluginableToolType;
  }

  await installPlugins(toolName);

  prompts.outro(pc.green("Plugins installed successfully!"));
}
