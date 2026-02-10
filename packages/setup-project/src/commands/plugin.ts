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
import gitCheck from "@/steps/git-check";
import { configurePrettierPlugins } from "@/services/formatter/prettier";
import { configureEslintPlugins } from "@/services/linter/eslint";

export async function plugin(toolName?: string) {
  introScreen();

  intro(pc.inverse(pc.bold(pc.magenta(" Plugin Manager "))));

  await gitCheck();

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
        ] as any,
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

  if (selectedTool === "prettier") {
    await configurePrettierPlugins(packagesToInstall);
    outro(pc.green("Prettier plugins configured in .prettierrc"));
  } else if (selectedTool === "eslint") {
    await configureEslintPlugins(packagesToInstall);
    outro(pc.green("ESLint plugins configured in .eslintrc.json"));
  }

  outro(pc.green("Plugins installed successfully!"));
}
