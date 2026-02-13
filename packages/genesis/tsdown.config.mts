import { defineConfig } from "tsdown";
import { constants } from "@mayrlabs/core";

export default defineConfig({
  entry: ["src/cli/genesis.ts"],
  format: ["cjs"],
  copy: ["assets"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  dts: false,
  banner: constants.brand.BANNER,
  footer: constants.brand.FOOTER,
});
