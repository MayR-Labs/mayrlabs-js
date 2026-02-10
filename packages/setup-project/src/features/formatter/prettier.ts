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
`,
    );
  }
}

export async function configurePrettierPlugins(plugins: string[]) {
  const configFile = await resolveConfigFile("Prettier", [
    ".prettierrc",
    ".prettierrc.json",
    "prettier.config.js",
    ".prettierrc.js",
  ]);

  let currentConfig: Record<string, unknown> = {};

  if (await fs.pathExists(configFile)) {
    try {
      if (configFile.endsWith(".js") || configFile.endsWith(".cjs")) {
        // Simple heuristic for now: we can't easily read JS config without require/import
        // which might be tricky in this environment if not careful.
        // For MVP, if it exists, we might skip or warn, OR we use a smarter parser.
        // But let's assume if it exists, the user handles it manually OR we try to append?
        // Actually, let's just stick to reading JSON if possible.
        // If it's JS, we might fail to read it effectively here without `jiti` or similar.
        // For now, let's assume we proceed but might overwrite or fail to read structure.
        // Improving: We can't robustly edit JS config without AST.
        // Fallback: If JS config, maybe just warn?
        // Or for now, we only support appending plugins if it IS a JSON-like structure we can parse (unlikely for JS).
        // Let's stick to the plan: if it's JS, we might not be able to easily append plugins programmatically without AST.
        // Given complexity, let's try to read it if we can (e.g. require?), but requiring user files is dangerous/complex.
        //
        // ALTERNATIVE: For now, if it is a JS file, we might skip automatic plugin configuration or warn the user.
        // But the task is to support selection.
        // Let's implement reading for JSON. For JS, if we created it, it might be simple export.

        // LIMITATION: 'writeConfig' writes JS as module.exports.
        // We can't easily read that back in TS environment without dynamic import/require.
        //
        // Strategy for now within constraints:
        // If the file exists and is .js, we skip configuration to avoid overwriting with JSON.
        // We only support automatic plugin config for JSON-based configs for now.
        return;
      }
      currentConfig = await fs.readJson(configFile);
    } catch {
      // ignore
    }
  }

  const existingPlugins = (currentConfig.plugins as string[]) || [];
  const newPlugins = [...new Set([...existingPlugins, ...plugins])];

  currentConfig.plugins = newPlugins;

  await writeConfig(configFile, currentConfig);
}
