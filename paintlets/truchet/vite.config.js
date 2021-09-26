import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

const projectPath = new URL(".", import.meta.url).pathname;
const srcPath = path.resolve(projectPath, "src");

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(srcPath, "index.ts"),
      name: "paintlet-truchet",
      fileName: (format) => `paintlet-truchet.${format}.js`,
    },
  },
});
