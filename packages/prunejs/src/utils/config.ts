import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

export const CONFIG_FILE = ".prunejs.config.js";

export const DEFAULT_EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out",
  "coverage",
  ".vercel",
  ".mayrlabs",
];

export const DEFAULT_INCLUDE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

export interface PruneConfig {
  excludeDirs?: string[];
  includeDirs?: string[];
  includeExtensions?: string[];
  excludeIgnoredFiles?: boolean;
  skipExportsIn?: string[];
}

export async function loadConfig(): Promise<PruneConfig> {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE);
  let userConfig: PruneConfig = {};

  if (fs.existsSync(configPath)) {
    try {
      const importedConfig = await import(configPath);
      userConfig = importedConfig.default || importedConfig;
    } catch (error) {
      console.error(
        "Error loading configuration file:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return {
    excludeDirs: userConfig.excludeDirs || DEFAULT_EXCLUDE_DIRS,
    includeDirs: userConfig.includeDirs || ["."],
    includeExtensions:
      userConfig.includeExtensions || DEFAULT_INCLUDE_EXTENSIONS,
    excludeIgnoredFiles:
      userConfig.excludeIgnoredFiles !== undefined
        ? userConfig.excludeIgnoredFiles
        : true,
    skipExportsIn: userConfig.skipExportsIn || getDefaultConfig().skipExportsIn,
  };
}

export function getDefaultConfig(): PruneConfig {
  return {
    excludeDirs: DEFAULT_EXCLUDE_DIRS,
    includeDirs: ["."],
    includeExtensions: DEFAULT_INCLUDE_EXTENSIONS,
    excludeIgnoredFiles: true,
    skipExportsIn: [
      "pages/**/*",
      "src/pages/**/*",
      "app/**/*",
      "src/app/**/*",
      "**/layout.{js,jsx,ts,tsx}",
      "**/page.{js,jsx,ts,tsx}",
      "**/route.{js,jsx,ts,tsx}",
      "**/loading.{js,jsx,ts,tsx}",
      "**/error.{js,jsx,ts,tsx}",
      "**/not-found.{js,jsx,ts,tsx}",
      "**/template.{js,jsx,ts,tsx}",
      "**/default.{js,jsx,ts,tsx}",
      "**/sitemap.{js,ts}",
      "**/siteMetadata.{js,ts}",
      "**/*.config.{js,ts}",
    ],
  };
}

export async function validateConfig(config: PruneConfig) {
  const riskyInclusions = (config.includeDirs || []).filter((dir) =>
    DEFAULT_EXCLUDE_DIRS.some((excluded) => dir.includes(excluded))
  );

  if (riskyInclusions.length > 0) {
    console.log(
      chalk.yellow(
        `\n⚠️  Warning: You have included directories that are typically excluded: ${riskyInclusions.join(
          ", "
        )}`
      )
    );

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message:
          "Are you sure you want to proceed with scanning these directories?",
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.red("Operation cancelled by user."));
      process.exit(0);
    }
  }
}
