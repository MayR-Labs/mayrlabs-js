/**
 * PruneJS v0.0.1 Config
 *
 * For more information, visit https://github.com/YoungMayor/prunejs#configuration
 */
module.exports = {
  excludeDirs: [
    "node_modules",
    ".next",
    ".git",
    "dist",
    "build",
    "out",
    "coverage",
    ".vercel",
    ".prunejs",
  ],
  includeDirs: ["."],
  includeExtensions: [".ts", ".tsx", ".js", ".jsx"],
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
