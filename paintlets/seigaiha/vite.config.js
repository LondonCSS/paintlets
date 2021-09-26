import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

const projectPath = new URL(".", import.meta.url).pathname;
const srcPath = path.resolve(projectPath, "src");

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(srcPath, "index.ts"),
      name: "paintlet-seigaiha",
      fileName: (format) => `paintlet-seigaiha.${format}.js`,
    },
  },
});
