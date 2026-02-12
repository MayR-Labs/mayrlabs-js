import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/cli/genesis.ts"],
  format: ["cjs"],
  copy: ["assets"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  banner: {
    js: `
/**
 * MayR Labs CLI
 * Build. Ship. Repeat intelligently.
 *
 * (c) ${new Date().getFullYear()} MayR Labs
 * https://mayrlabs.com
 */
`,
  },

  footer: {
    js: `
/**
 * Built with discipline by MayR Labs.
 * Software should feel intentional.
 */
`,
  },
  dts: false,
});
