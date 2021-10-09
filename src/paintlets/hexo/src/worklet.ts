import SimplexNoise from "https://cdn.skypack.dev/simplex-noise";

import * as houdini from "../../../../typings/houdini";

import { parseInput } from "../../../_lib/utils";

type InputKey = typeof inputProps[number];
type DefaultProps = typeof defaultProps;
type InputRecord = Record<InputKey, string>;
type StyleKey = keyof typeof styles;
type FillProps = { h: string; s: string; l: string; a: string };

export const inputProps = [
  "--style",
  "--radius",
  "--gap",
  "--fill",
  "--stroke-width",
  "--stroke-colour",
] as const;
export const defaultProps = {
  style: "overlay" as StyleKey,
  radius: 16,
  gap: 0,
  fill: "",
  strokeWidth: 0,
  strokeColour: "#fff",
};

const a = (2 * Math.PI) / 6;

const hslRegex = /hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,?\s?(\d*\.?\d+)?\)/g;

function parseFill(fill: string): FillProps | undefined {
  if (fill.length) {
    const [h, s, l, a] = [...fill.matchAll(hslRegex)][0].slice(1);
    return { h, s, l, a };
  }
}

function drawHex(x: number, y: number, rad: number) {
  const path = new Path2D();
  for (let i = 0; i < 6; i++) {
    path.lineTo(x + rad * Math.cos(a * i), y + rad * Math.sin(a * i));
  }
  path.closePath();

  return path;
}

function rainbow(n: number) {
  const h = Math.floor((360 * (n - 1)) / 2);
  const hsl = `hsl(${h}, 55%, 55%)`;
  return hsl;
}

function hue(n: number, fillProps?: FillProps) {
  const { h, s, a } = { h: "0", s: "50", a: "1", ...fillProps };
  const l = Math.floor(50 * n + 25) / 2;
  const hsl = `hsl(${h}, ${s}%, ${l}%, ${a})`;
  return hsl;
}

function overlay(n: number, fillProps?: FillProps) {
  const { h, s, l } = { h: "0", s: "0", l: "100", ...fillProps };
  const a = (n - 0.75) / 2;

  const hsl = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  return hsl;
}

const styles = {
  hue,
  overlay,
  rainbow,
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
    gap: parseInput(props["--gap"], opts.gap, "float") as number,
    fill: parseInput(props["--fill"], opts.fill) as string,
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

    const { radius: r, gap, style, fill, strokeWidth, strokeColour } = props;
    const styleFn = getStyle(style);
    const noise = new SimplexNoise();
    const scale = 0.002;

    const rowH = r * Math.sin(a);
    const colW = r * (1 + Math.cos(a));
    let fillProps = parseFill(fill);

    // const radiusMin = Math.sqrt(Math.pow(r, 2) - Math.pow(r / 2, 2));
    // console.log(rowH, radiusMin);

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

        switch (style) {
          case "rainbow":
            ctx.fillStyle = rainbow(n);
            ctx.fill(path);
            break;

          case "rainbow-stroke":
            ctx.strokeStyle = rainbow(n);
            ctx.stroke(path);
            break;

          default:
            if (props.fill.length) {
              ctx.fillStyle = styleFn(n, fillProps);
              ctx.fill(path);
            }
            if (strokeWidth > 0) {
              ctx.stroke(path);
            }
            break;
        }
      }
    }
  }
}
