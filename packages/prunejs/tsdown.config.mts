import { defineConfig } from "tsdown";
import { constants } from "@repo/mayrlabs-core";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["cjs"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  dts: false,
  banner: constants.brand.BANNER,
  footer: constants.brand.FOOTER,
});
