import SimplexNoise from "https://cdn.skypack.dev/simplex-noise";

import * as houdini from "../../../typings/houdini";

import { parseInput } from "../../_lib/utils";

type InputKey = typeof inputProps[number];
type DefaultProps = typeof defaultProps;
type InputRecord = Record<InputKey, string>;
type StyleKey = keyof typeof styles;

export const inputProps = [
  "--style",
  "--radius",
  "--hue",
  "--gap",
  "--stroke-width",
  "--stroke-colour",
] as const;
export const defaultProps = {
  style: "overlay" as StyleKey,
  radius: 16,
  hue: 180,
  gap: 0,
  strokeWidth: 0,
  strokeColour: "#fff",
};

const a = (2 * Math.PI) / 6;

function drawHex(x: number, y: number, rad: number) {
  const path = new Path2D();
  for (let i = 0; i < 6; i++) {
    path.lineTo(x + rad * Math.cos(a * i), y + rad * Math.sin(a * i));
  }
  path.closePath();

  return path;
}

function rainbow(n: number) {
  const h = Math.floor((360 * n) / 3);
  const hsl = `hsl(${h}, 50%, 50%)`;
  return hsl;
}

function monochrome(n: number) {
  const l = Math.floor((100 * n) / 2);
  const hsl = `hsl(0, 0%, ${l}%)`;
  return hsl;
}

function hue(n: number, h: number) {
  const l = Math.floor((100 * n) / 2);
  const hsl = `hsl(${h}, 50%, ${l}%)`;
  return hsl;
}

function overlay(n: number) {
  // const a = n / 2 - 0.25;
  const a = (n - 1) / 2;

  console.log(a);

  const hsl = `hsla(0, 100%, 100%, ${a})`;
  return hsl;
}

const styles = {
  rainbow,
  monochrome,
  hue,
  overlay,
};

function getStyle(style: StyleKey) {
  return styles[style] || overlay;
}

export function normalizeProps(
  rawProps: houdini.StylePropertyMapReadOnly,
  opts: DefaultProps
): DefaultProps {
  const props = {} as InputRecord;
  for (const [key, value] of rawProps.entries()) {
    props[key as InputKey] = value.toString().trim();
  }

  return {
    style: parseInput(props["--style"], opts.style) as StyleKey,
    radius: parseInput(props["--radius"], opts.radius, "int") as number,
    hue: parseInput(props["--hue"], opts.hue, "int") as number,
    gap: parseInput(props["--gap"], opts.gap, "float") as number,
    strokeWidth: parseInput(props["--stroke-width"], opts.strokeWidth, "float") as number,
    strokeColour: parseInput(props["--stroke-colour"], opts.strokeColour) as string,
  };
}

export class Hexo implements houdini.PaintCtor {
  public static inputProperties = inputProps;

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normalizeProps(rawProps, defaultProps);

    const { radius: r, gap, style, strokeWidth, strokeColour } = props;
    const styleFn = getStyle(style);
    const noise = new SimplexNoise();
    const scale = 0.002;

    const rowH = r * Math.sin(a);
    const colW = r * (1 + Math.cos(a));

    const radiusMin = Math.sqrt(Math.pow(r, 2) - Math.pow(r / 2, 2));
    console.log(rowH, radiusMin);

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColour;

    for (let y = 0; y + rowH <= height + rowH; y += rowH) {
      for (
        let x = 0, j = 0; // initialise row vars
        x + colW <= width + colW * 2; // predicate
        x += colW, y += (-1) ** j++ * rowH // increment row vars
      ) {
        const path = drawHex(x, y, r - gap);
        const n = noise.noise2D(scale * x, scale * y) + 1;

        ctx.fillStyle = styleFn(n, props.hue);
        ctx.fill(path);
        if (strokeWidth > 0) ctx.stroke(path);
      }
    }
  }
}
