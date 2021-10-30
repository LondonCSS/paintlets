/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * @typedef {(import("vite").UserConfig)} UserConfig
 * @typedef {(import("vite").LibraryOptions)} LibraryOptions
 */

import path from "path";
import { URL } from "url";

/**
 * @param {string} baseUrl
 * @returns {LibraryOptions}
 */
export function getLibConfig(baseUrl) {
  const modulePath = new URL(".", baseUrl).pathname;
  const srcPath = path.resolve(modulePath, "src");
  const moduleName = path.dirname(srcPath).split(path.sep).pop();

  return {
    entry: path.resolve(srcPath, "index.ts"),
    name: moduleName,
    fileName: (format) => `paintlet.${format}.js`,
  };
}
