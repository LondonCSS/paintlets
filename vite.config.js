// @ts-check

import path from "path";
import { URL } from "url";

const projectPath = new URL(".", import.meta.url).pathname;
const srcPath = path.resolve(projectPath, "src");

export default {
  // build: {
  //   rollupOptions: {
  //     input: {
  //       truchet: path.resolve(srcPath, "truchet/truchet.ts"),
  //       seigaiha: path.resolve(srcPath, "seigaiha/seigaiha.ts"),
  //     },
  //   },
  // },
};
