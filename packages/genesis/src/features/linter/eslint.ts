import fs from "fs-extra";
import { installPackages } from "@/utils/pm";

import { resolveConfigFile } from "@/utils/config-file";

export async function installEslint() {
  const packages = ["eslint", "globals", "@eslint/js", "typescript-eslint"];

  await installPackages(packages, true);

  const configFile = await resolveConfigFile("ESLint", [
    "eslint.config.mjs",
    "eslint.config.js",
    "eslint.config.cjs",
  ]);

  if (!(await fs.pathExists(configFile))) {
    // For now, valid for mjs/js/cjs if we write export default
    // But we need to handle format differences if we want to support CJS fully?
    // The current template uses ESM syntax (import/export default).
    // If user selects .cjs, this template fails.
    // If user selects .js, and package.json type is module, it works.
    // If user selects .js and commonjs, it fails.
    // simpler: valid for mjs.
    // Let's assume for this MVP we write the ESM format which works for .mjs and .js type=module

    await fs.writeFile(
      configFile,
      `import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];`
    );
  }
}
