import { constants } from "@mayrlabs/core";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/hello.ts"],
  format: ["cjs"],
  clean: true,
  shims: true,
  target: "node18",
  minify: true,
  dts: false,
  banner: constants.brand.BANNER,
  footer: constants.brand.FOOTER,
});
