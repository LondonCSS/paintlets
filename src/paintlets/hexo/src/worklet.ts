import SimplexNoise from "simplex-noise";

import * as houdini from "../../../../typings/houdini";
import { normaliseInput } from "../../../_lib/utils";

type FillProps = { h: string; s: string; l: string; a: string };

type PaintletProps = {
  style: string;
  radius: number;
  gap: number;
  fill: string;
  strokeWidth: number;
  strokeColour: string;
};

export const defaultProps = {
  "--style": {
    key: "style",
    value: "overlay",
    parseAs: "string",
  },
  "--radius": {
    key: "radius",
    value: 16,
    parseAs: "int",
  },
  "--gap": {
    key: "gap",
    value: 0,
    parseAs: "float",
  },
  "--fill": {
    key: "fill",
    value: "",
    parseAs: "string",
  },
  "--stroke-width": {
    key: "strokeWidth",
    value: 0,
    parseAs: "float",
  },
  "--stroke-colour": {
    key: "strokeColour",
    value: "#fff",
    parseAs: "string",
  },
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

/**
 * Create a layer varying the hue
 */
function rainbow(n: number) {
  const h = Math.floor((300 * (n - 1)) / 2);
  const hsl = `hsl(${h}, 40%, 65%)`;
  return hsl;
}

/**
 * Create a layer in the supplied colour (or black if not supplied), varying the lightness
 */
function hue(n: number, fillProps?: FillProps) {
  const { h, s, a } = { h: "0", s: "50", a: "1", ...fillProps };
  const l = Math.floor(50 * n + 25) / 2;
  const hsl = `hsl(${h}, ${s}%, ${l}%, ${a})`;
  return hsl;
}

/**
 * Create a layer in the supplied colour (or black if not supplied), varying the transparency
 */
function overlay(n: number, fillProps?: FillProps) {
  const { h, s, l } = { h: "0", s: "0", l: "100", ...fillProps };
  const a = (n - 0.75) / 2;

  const hsl = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  return hsl;
}

function drawPathFn(
  ctx: houdini.PaintRenderingContext2D,
  { style, fill, strokeWidth }: DefaultProps
) {
  let fillProps: FillProps | undefined;
  if (fill.length) fillProps = parseFill(fill);

  return function (path: Path2D, n: number) {
    switch (style) {
      case "rainbow":
        ctx.fillStyle = rainbow(n);
        ctx.fill(path);
        break;

      case "rainbow-stroke":
        ctx.strokeStyle = rainbow(n);
        ctx.stroke(path);
        break;

      case "hue":
        if (fillProps) {
          ctx.fillStyle = hue(n, fillProps);
          ctx.fill(path);
        }
        if (strokeWidth > 0) {
          ctx.stroke(path);
        }
        break;

      case "overlay":
      default:
        if (fillProps) {
          ctx.fillStyle = overlay(n, fillProps);
          ctx.fill(path);
        }
        if (strokeWidth > 0) {
          ctx.stroke(path);
        }
        break;
    }
  };
}

// TODO: allow "pointy" mode
export class Hexo implements houdini.PaintCtor {
  public static defaultProperties = defaultProps;
  public static inputProperties = Object.keys(Hexo.defaultProperties);

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normaliseInput(rawProps, Hexo) as PaintletProps;
    const drawPath = drawPathFn(ctx, props);

    const { radius: r, gap, strokeWidth, strokeColour } = props;
    const noise = new SimplexNoise();
    const scale = 0.002; // TODO make this configurable

    const rMin = r * Math.sin(a);
    const rowH = rMin * 2;
    const colW = r * 1.5;
    const rowNum = 1 + Math.ceil(height / rowH);
    const colNum = 1 + Math.ceil(width / colW);

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColour;

    for (let i = 0; i < rowNum; i++) {
      const y = i * rowH;

      for (let j = 0; j < colNum; j++) {
        const x = j * colW;
        const yOff = j % 2 === 0 ? 0 : rMin;

        const path = drawHex(x, y + yOff, r - gap);
        const n = noise.noise2D(scale * x, scale * y) + 1;
        drawPath(path, n);
      }
    }
  }
}
