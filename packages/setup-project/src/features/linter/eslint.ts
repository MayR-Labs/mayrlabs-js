import fs from "fs-extra";
import { installPackages } from "@/utils/pm";
import { PLUGINS } from "@/constants/plugins";

export async function installEslint() {
  const packages = ["eslint", "globals", "@eslint/js", "typescript-eslint"];

  await installPackages(packages, true);

  if (!(await fs.pathExists("eslint.config.mjs"))) {
    await fs.writeFile(
      "eslint.config.mjs",
      `import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];`,
    );
  }
}

export async function configureEslintPlugins(plugins: string[]) {
  const configFile = "eslint.config.mjs";

  if (!(await fs.pathExists(configFile))) {
    return;
  }

  let configContent = await fs.readFile(configFile, "utf-8");

  const newImports: string[] = [];
  const newPluginConfigs: string[] = [];

  for (const pluginName of plugins) {
    const pluginDef = PLUGINS.eslint.find((p) => p.value === pluginName);
    const packageName = pluginDef?.package || `eslint-plugin-${pluginName}`;

    const safeVarName = pluginName.replace(/[^a-zA-Z0-9]/g, "") + "Plugin";

    if (!configContent.includes(`import ${safeVarName}`)) {
      newImports.push(`import ${safeVarName} from "${packageName}";`);
    }

    const shorPluginName = pluginName.replace(/^eslint-plugin-/, "");
    newPluginConfigs.push(`"${shorPluginName}": ${safeVarName}`);
  }

  if (newImports.length > 0) {
    const lastImportIndex = configContent.lastIndexOf("import ");
    const endOfLastImport = configContent.indexOf("\n", lastImportIndex) + 1;

    configContent =
      configContent.slice(0, endOfLastImport) +
      newImports.join("\n") +
      "\n" +
      configContent.slice(endOfLastImport);
  }

  if (newPluginConfigs.length > 0) {
    const exportDefaultStart = configContent.indexOf("export default [");

    if (exportDefaultStart !== -1) {
      const pluginsBlock = `
  {
    plugins: {
      ${newPluginConfigs.join(",\n      ")}
    }
  },`;

      const insertPos = exportDefaultStart + "export default [".length;
      configContent =
        configContent.slice(0, insertPos) +
        pluginsBlock +
        configContent.slice(insertPos);
    }
  }

  await fs.writeFile(configFile, configContent);
}
