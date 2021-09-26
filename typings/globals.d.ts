import { PaintCtor } from "./houdini.js";

declare function registerPaint(name: string, paintlet: PaintCtor): void;

declare module "lerp";
declare module "chroma-js";
declare module "canvas-sketch-util/math";
