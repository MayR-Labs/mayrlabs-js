import fs from "fs-extra";
import { installPackages } from "@/utils/pm";

export async function installPrettier() {
  await installPackages(["prettier"], true);

  if (!(await fs.pathExists(".prettierrc"))) {
    await fs.writeJson(
      ".prettierrc",
      {
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "es5",
        printWidth: 80,
        plugins: [],
      },
      { spaces: 2 },
    );
  }

  if (!(await fs.pathExists(".prettierignore"))) {
    await fs.writeFile(
      ".prettierignore",
      `node_modules
dist
coverage
.next
.nuxt
build
.astro
.output
`,
    );
  }
}

export async function configurePrettierPlugins(plugins: string[]) {
  const configFile = ".prettierrc";
  let currentConfig: any = {};

  if (await fs.pathExists(configFile)) {
    try {
      currentConfig = await fs.readJson(configFile);
    } catch (e) {
      // ignore
    }
  }

  const existingPlugins = currentConfig.plugins || [];
  const newPlugins = [...new Set([...existingPlugins, ...plugins])];

  currentConfig.plugins = newPlugins;

  await fs.writeJson(configFile, currentConfig, { spaces: 2 });
}
