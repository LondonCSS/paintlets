/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").UserConfigExport)} UserConfigExport
 */

import path from "path";
import { URL } from "url";
import { defineConfig } from "vite";

/**
 * @param {string} baseUrl
 * @returns {UserConfigExport}
 */
export function getConfig(baseUrl) {
  const modulePath = new URL(".", baseUrl).pathname;
  const srcPath = path.resolve(modulePath, "src");
  const moduleName = path.dirname(srcPath).split(path.sep).pop();
  const moduleId = `paintlet-${moduleName}`;

  return defineConfig({
    build: {
      lib: {
        entry: path.resolve(srcPath, "index.ts"),
        name: moduleId,
        fileName: (format) => `${moduleId}.${format}.js`,
      },
    },
  });
}
