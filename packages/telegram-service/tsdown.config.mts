import { defineConfig } from "tsdown";

const YEAR_FOUNDED = 2025;

const copyrightYear = (): string => {
  const currentYear = new Date().getFullYear();

  return currentYear === YEAR_FOUNDED
    ? currentYear.toString()
    : `${YEAR_FOUNDED} - ${currentYear}`;
};

const BANNER = {
  js: `/// (c) ${copyrightYear()} MayR Labs - https://mayrlabs.com`,
};

const FOOTER = {
  js: ``,
};

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs", "esm"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  dts: true,
  logLevel: "warn",
  banner: BANNER,
  footer: FOOTER,
});
