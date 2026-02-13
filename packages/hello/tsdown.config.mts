import { defineConfig } from "tsdown";

const YEAR_FOUNDED = 2025;

const copyrightYear = (): string => {
  const currentYear = new Date().getFullYear();

  return currentYear === YEAR_FOUNDED
    ? currentYear.toString()
    : `${YEAR_FOUNDED} - ${currentYear}`;
};

const BANNER = {
  js: `
/**
 * MayR Labs
 * Build. Ship. Repeat intelligently.
 *
 * (c) ${copyrightYear()} MayR Labs
 * https://mayrlabs.com
 */
`,
};

const FOOTER = {
  js: `
/**
 * Built with discipline by MayR Labs.
 * Software should feel intentional.
 */
`,
};

export default defineConfig({
  entry: ["src/hello.ts"],
  format: ["cjs"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  dts: false,
  banner: BANNER,
  footer: FOOTER,
});
