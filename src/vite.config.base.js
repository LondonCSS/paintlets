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
  const paintletPath = new URL(".", baseUrl).pathname;
  const srcPath = path.resolve(paintletPath, "src");
  const paintletName = path.dirname(srcPath).split(path.sep).pop();
  const paintletId = `paintlet-${paintletName}`;

  return defineConfig({
    build: {
      lib: {
        entry: path.resolve(srcPath, "index.ts"),
        name: paintletId,
        fileName: (format) => `${paintletId}.${format}.js`,
      },
    },
  });
}
