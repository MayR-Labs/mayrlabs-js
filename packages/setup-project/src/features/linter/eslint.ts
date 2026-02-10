import fs from "fs-extra";
import { installPackages } from "@/utils/pm";

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
  const configFile = ".eslintrc.json";
  let currentConfig: any = {};

  if (await fs.pathExists(configFile)) {
    try {
      currentConfig = await fs.readJson(configFile);
    } catch (e) {
      // ignore
    }
  }

  // Add to plugins array
  const existingPlugins = currentConfig.plugins || [];
  // Plugins often drop "eslint-plugin-" prefix in config, but keeping full name is safer or strictly following convention
  // Convention: "eslint-plugin-react" -> "react"
  // We will add the simple name if it starts with eslint-plugin-

  const simplifiedPlugins = plugins.map((p) => p.replace("eslint-plugin-", ""));

  const newPlugins = [...new Set([...existingPlugins, ...simplifiedPlugins])];
  currentConfig.plugins = newPlugins;

  // We might also want to extend "plugin:package/recommended" but that's heuristic.
  // For now, just adding to plugins.

  await fs.writeJson(configFile, currentConfig, { spaces: 2 });
}
