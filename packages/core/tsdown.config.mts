import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cli/index.ts", "src/bin.ts"],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  target: "node18",
  minify: true,
  // banner: constants.brand.BANNER,
  // footer: constants.brand.FOOTER,
});
