import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: false,
  format: ["esm"],
  sourcemap: false,
  target: "es2020",
  tsconfig: "tsconfig.base.json",
});
