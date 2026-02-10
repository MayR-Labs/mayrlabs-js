import { intro, outro, select } from "@clack/prompts";
import pc from "picocolors";
import { PluginableToolType } from "@/constants/plugins";
import { withCancelHandling } from "@/utils/handle-cancel";
import { introScreen } from "@/utils/display";
import gitCheck from "@/steps/git-check";
import { Option } from "@/constants/options";
import { installPlugins } from "@/steps/install-plugin";

export async function plugin(toolName?: PluginableToolType) {
  introScreen();

  intro(pc.inverse(pc.bold(pc.magenta(" Plugin Manager "))));

  await gitCheck();

  if (!toolName) {
    toolName = (await withCancelHandling(async () =>
      select({
        message: "Select a tool to add plugins to:",
        options: [
          { value: "eslint", label: "ESLint" },
          { value: "prettier", label: "Prettier" },
        ] satisfies Option<PluginableToolType>[],
      }),
    )) as PluginableToolType;
  }

  await installPlugins(toolName);

  outro(pc.green("Plugins installed successfully!"));
}
