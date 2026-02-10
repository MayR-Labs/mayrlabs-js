import { intro, outro, select, multiselect, isCancel } from "@clack/prompts";
import pc from "picocolors";
import {
  ESLINT_PLUGINS,
  PRETTIER_PLUGINS,
  PluginOption,
} from "@/constants/plugins";
import { withCancelHandling } from "@/utils/handle-cancel";
import { introScreen } from "@/utils/display";
import { installPackages } from "@/utils/pm";
import { Tool } from "@/config/types";

export async function plugin(toolName?: string) {
  introScreen();

  intro(pc.inverse(pc.bold(pc.magenta(" Plugin Manager "))));

  let selectedTool = toolName;

  if (
    !selectedTool ||
    (selectedTool !== "eslint" && selectedTool !== "prettier")
  ) {
    const selection = (await withCancelHandling(async () =>
      select({
        message: "Select a tool to add plugins to:",
        options: [
          { value: "eslint", label: "ESLint" },
          { value: "prettier", label: "Prettier" },
        ],
      }),
    )) as string as Tool;

    selectedTool = selection;
  }

  let pluginsList: PluginOption[] = [];

  if (selectedTool === "eslint") {
    pluginsList = ESLINT_PLUGINS;
  } else if (selectedTool === "prettier") {
    pluginsList = PRETTIER_PLUGINS;
  }

  if (pluginsList.length === 0) {
    outro(pc.yellow(`No plugins available for ${selectedTool}.`));
    return;
  }

  const selectedPlugins = (await withCancelHandling(async () =>
    multiselect({
      message: `Select ${selectedTool} plugins to install:`,
      options: pluginsList,
      required: false,
    }),
  )) as string[];

  if (selectedPlugins.length === 0) {
    outro(pc.yellow("No plugins selected."));
    return;
  }

  const packagesToInstall = selectedPlugins.map((val) => {
    const p = pluginsList.find((opt) => opt.value === val);
    return p ? p.package : val;
  });

  outro(
    pc.blue(
      `Installing ${packagesToInstall.length} plugins for ${selectedTool}...`,
    ),
  );

  await installPackages(packagesToInstall, true);

  // @ai: Implement this
  // Todo: configuring the plugins automatically in .eslintrc or .prettierrc is complex
  // without parsing existing config. For now, we simple install them.
  // The user request says "Select and install plugins".
  // Adding to config might be an enhancement.
  // For prettier, mostly adding to "plugins": [] in .prettierrc (if generic).
  // For eslint, extends or plugins array.

  outro(pc.green("Plugins installed successfully!"));
  console.log(
    pc.dim(
      "Note: You may need to manually add these plugins to your configuration file.",
    ),
  );
}
