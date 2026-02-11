import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  clean: true,
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
