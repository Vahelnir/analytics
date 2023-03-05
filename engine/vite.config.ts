import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/main.ts",
      name: "analytics",
      fileName: "analytics",
      formats: ["iife", "es"],
    },
  },
});
