import { defineConfig } from "tsdown";

const YEAR_FOUNDED = 2025;

const copyrightYear = (): string => {
  const currentYear = new Date().getFullYear();

  return currentYear === YEAR_FOUNDED
    ? currentYear.toString()
    : `${YEAR_FOUNDED} - ${currentYear}`;
};

const BANNER = {
  js: `/// (c) ${copyrightYear()} MayR Labs https://mayrlabs.com`,
};

const FOOTER = {
  js: `/// Built with discipline by MayR Labs.`,
};

export default defineConfig({
  entry: {
    index: "src/index.tsx",
    client: "src/client/index.tsx",
    issuer: "src/issuer/index.ts",
    provider: "src/client/provider.tsx",
  },
  format: ["cjs", "esm"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  dts: true,
  deps: {
    neverBundle: [/^next($|(\/.*))/, "react", "react-dom", "@mayrlabs/auth"],
  },
  logLevel: "warn",
  banner: BANNER,
  footer: FOOTER,
});
