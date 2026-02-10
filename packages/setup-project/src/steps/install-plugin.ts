import { PluginableToolType, PLUGINS } from "@/constants/plugins";
import { configurePrettierPlugins } from "@/features/formatter/prettier";
import { configureEslintPlugins } from "@/features/linter/eslint";
import { withCancelHandling } from "@/utils/handle-cancel";
import { installPackages } from "@/utils/pm";
import { multiselect, outro, confirm } from "@clack/prompts";
import pc from "picocolors";

export async function installPlugins(tool: PluginableToolType) {
  const pluginsList = PLUGINS[tool];

  const selectedPlugins = (await withCancelHandling(async () =>
    multiselect({
      message: `Select ${tool} plugins to install:`,
      options: pluginsList,
      required: true,
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
    confirm({
      message: `Do you want to configure the selected plugins in your ${tool} config file?`,
      initialValue: true,
    }),
  )) as boolean;

  if (!shouldConfigure) {
    outro(pc.yellow("Skipping configuration."));
    return;
  }

  switch (tool) {
    case "prettier":
      await configurePrettierPlugins(plugins);

      outro(pc.green("Prettier plugins configured in .prettierrc"));
      break;

    case "eslint":
      await configureEslintPlugins(plugins);

      outro(pc.green("ESLint plugins configured in .eslintrc.json"));
      break;
  }
}
