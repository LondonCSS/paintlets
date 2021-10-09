/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").UserConfigExport)} UserConfigExport
 */

import fs from "fs";
import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

/**
 * Paths to the index html files of the paintlets
 * @param {string} paintletsPath
 */
 function getPaintletPages(paintletsPath) {
  const paths = [];
  const files = fs.readdirSync(paintletsPath);
  for (const file of files) {
    const dirPath = path.resolve(paintletsPath, file);
    const pagePath = path.join(dirPath, "index.html");
    paths.push(pagePath);
  }

  return paths;
}

const rootPath = new URL(".", import.meta.url).pathname;
const paintletsPath = path.join(rootPath, "src/paintlets");

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: path.resolve(rootPath, "index.html"),
        ...getPaintletPages(paintletsPath),
      },
    },
  },
});
