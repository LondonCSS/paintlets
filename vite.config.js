/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").UserConfigExport)} UserConfigExport
 */

import fs from "fs";
import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

const rootPath = new URL(".", import.meta.url).pathname;

// TODO Automatically create routes for all files in `/examples`
const examplePath = path.join(rootPath, "examples");
const examplePages = fs.readdirSync(examplePath);
const exampleRoutes = {};
for (const page of examplePages) {
  const pagePath = path.join(examplePath, page);
  const pageName = page.replace(/\.html$/, "");
  exampleRoutes[pageName] = pagePath;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootPath, "index.html"),
        ...exampleRoutes
      },
    },
  },
});
