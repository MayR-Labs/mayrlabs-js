import { PluginableToolType, PLUGINS } from "@/constants/plugins";
import { configurePrettierPlugins } from "@/features/formatter/prettier";
import { configureEslintPlugins } from "@/features/linter/eslint";
import { withCancelHandling } from "@/utils/handle-cancel";
import { installPackages } from "@/utils/pm";
import { prompts } from "@/utils/prompts";
import pc from "picocolors";

export async function installPlugins(tool: PluginableToolType) {
  const pluginsList = PLUGINS[tool];

  const selectedPlugins = (await withCancelHandling(async () =>
    prompts.multiselect({
      message: `Select ${tool} plugins to install:`,
      options: pluginsList,
      required: true,
      initialValue: [],
    }),
  )) as string[];

  if (selectedPlugins.length === 0) {
    prompts.outro(pc.yellow("No plugins selected."));
    return;
  }

  const packagesToInstall = selectedPlugins.map((val) => {
    const p = pluginsList.find((opt) => opt.value === val);
    return p ? p.package : val;
  });

  prompts.outro(
    pc.blue(`Installing ${packagesToInstall.length} plugins for ${tool}...`),
  );

  await installPackages(packagesToInstall, true);

  await configurePlugins(tool, selectedPlugins);
}

export async function configurePlugins(
  tool: PluginableToolType,
  plugins: string[],
) {
  const shouldConfigure = (await withCancelHandling(async () =>
    prompts.confirm({
      message: `Do you want to configure the selected plugins in your ${tool} config file?`,
      initialValue: true,
    }),
  )) as boolean;

  if (!shouldConfigure) {
    prompts.outro(pc.yellow("Skipping configuration."));
    return;
  }

  switch (tool) {
    case "prettier":
      await configurePrettierPlugins(plugins);

      prompts.outro(pc.green("Prettier plugins configured in .prettierrc"));
      break;

    case "eslint":
      await configureEslintPlugins(plugins);

      prompts.outro(pc.green("ESLint plugins configured in .eslintrc.json"));
      break;
  }
}
