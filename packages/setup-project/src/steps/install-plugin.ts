import { PluginableToolType, PLUGINS } from "@/constants/plugins";
import { configurePrettierPlugins } from "@/services/formatter/prettier";
import { configureEslintPlugins } from "@/services/linter/eslint";
import { withCancelHandling } from "@/utils/handle-cancel";
import { installPackages } from "@/utils/pm";
import { multiselect, outro } from "@clack/prompts";
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

  configurePlugins(tool, selectedPlugins);
}

export async function configurePlugins(
  tool: PluginableToolType,
  plugins: string[],
) {
  // @ai: Ask if the user want to configure the plugins

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
