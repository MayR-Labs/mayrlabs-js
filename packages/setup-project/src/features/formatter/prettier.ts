import fs from "fs-extra";
import { installPackages } from "@/utils/pm";
import { resolveConfigFile, writeConfig } from "@/utils/config-file";

export async function installPrettier() {
  await installPackages(["prettier"], true);

  const configFile = await resolveConfigFile("Prettier", [
    ".prettierrc",
    ".prettierrc.json",
    "prettier.config.js",
    ".prettierrc.js",
  ]);

  if (!(await fs.pathExists(configFile))) {
    await writeConfig(configFile, {
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 80,
      plugins: [],
    });
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
`
    );
  }
}
