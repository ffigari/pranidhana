import { defineConfig } from "tsup";
import path from "path";
import aliasPlugin from "esbuild-plugin-alias";

export default defineConfig({
  clean: true,
  dts: false,
  format: ["esm"],
  sourcemap: false,
  target: "es2020",
  tsconfig: "tsconfig.base.json",
  esbuildPlugins: [
    aliasPlugin({
      "@domain": path.resolve(__dirname, "src/domain"),
      "@core": path.resolve(__dirname, "src/core"),
      "@bootstrap": path.resolve(__dirname, "src/bootstrap/index.ts"),
      "@persistent-memory": path.resolve(__dirname, "src/persistent-memory/index.ts"),
    }),
  ],
});
