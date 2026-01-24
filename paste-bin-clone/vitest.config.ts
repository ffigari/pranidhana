import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "src/domain"),
      "@core": path.resolve(__dirname, "src/core"),
      "@bootstrap": path.resolve(__dirname, "src/bootstrap/index.ts"),
      "@persistent-memory": path.resolve(__dirname, "src/persistent-memory/index.ts"),
      "@web-ui": path.resolve(__dirname, "src/web-ui"),
    },
  },
});
