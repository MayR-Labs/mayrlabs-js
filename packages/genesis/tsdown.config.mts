import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/cli/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  publicDir: "assets",
  shims: true,
  target: "node18",
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
});
