import SimplexNoise from "https://cdn.skypack.dev/simplex-noise";

import * as houdini from "../../../typings/houdini";

import { parseInput } from "../../_lib/utils";

type InputKey = typeof inputProps[number];
type DefaultProps = typeof defaultProps;
type InputRecord = Record<InputKey, string>;

export const inputProps = [] as const;
export const defaultProps = {};

export function normalizeProps(
  rawProps: houdini.StylePropertyMapReadOnly,
  opts: DefaultProps
): DefaultProps {
  const props = {} as InputRecord;
  for (const [key, value] of rawProps.entries()) {
    props[key as InputKey] = value.toString().trim();
  }

  console.log({ opts, props });

  return props as DefaultProps;
}

export class Hexo implements houdini.PaintCtor {
  public static inputProperties = inputProps;

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normalizeProps(rawProps, defaultProps);
    console.log({ ctx, width, height, props });

    const noise = new SimplexNoise();
    // const gridUnit = 50;
    // const scale = 0.001;
    const gridUnit = 25;
    const scale = 0.002;

    for (let x = 0; x < width; x += gridUnit) {
      for (let y = 0; y < height; y += gridUnit) {
        const c = Math.floor((255 * (noise.noise2D(scale * x, scale * y) + 1)) / 2);
        const fillStyle = `rgb(${c}, ${c}, ${c})`;
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, gridUnit, gridUnit);
      }
    }
  }
}
