import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
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
