import * as houdini from "../../../typings/houdini";

import { parseInput } from "../../_lib/utils";

type DefaultProps = typeof defaultProps;
type InputKey = typeof inputProps[number];
type InputRecord = Record<InputKey, string>;

const PI2 = Math.PI * 2;

export const inputProps = [
  "--radius",
  "--rings",
  "--stroke-width",
  "--stroke-colour",
  "--colours",
] as const;
export const defaultProps = {
  radius: 55,
  ringNum: 5,
  strokeWidth: 0.5,
  strokeColour: "#b6b58e",
  colours: ["#0b605f", "#402132"],
};

export function normalizeProps(
  rawProps: houdini.StylePropertyMapReadOnly,
  opts: DefaultProps
): DefaultProps {
  const props = {} as InputRecord;
  for (const [key, value] of rawProps.entries()) {
    props[key as InputKey] = value.toString().trim();
  }

  return {
    radius: parseInput(props["--radius"], opts.radius, "int") as number,
    ringNum: parseInput(props["--rings"], opts.ringNum, "int") as number,
    colours: parseInput(props["--colours"], opts.colours, "colours") as string[],
    strokeWidth: parseInput(props["--stroke-width"], opts.strokeWidth, "float") as number,
    strokeColour: parseInput(props["--stroke-colour"], opts.strokeColour) as string,
  };
}

export function makeCircle(
  ctx: houdini.PaintRenderingContext2D,
  x: number,
  y: number,
  radii: number[]
): void {
  for (const r of radii) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, PI2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}

export function circleFactory(
  ctx: houdini.PaintRenderingContext2D,
  radius: number,
  ringNum: number,
  fn: typeof makeCircle
): (x: number, y: number) => void {
  const ringW = 1 / ringNum;
  const rings = [];
  let n = 1;
  while (n > 0) {
    rings.push(n);
    n -= ringW;
  }
  const radii = rings.map((r) => r * radius);

  return function makeCircles(x: number, y: number) {
    fn(ctx, x, y, radii);
  };
}

export class Seigaiha implements houdini.PaintCtor {
  public static inputProperties = inputProps;

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normalizeProps(rawProps, defaultProps);
    const { radius, ringNum } = props;
    const [colourA, colourB] = props.colours;

    console.log({ colourA, colourB });

    ctx.fillStyle = colourA;
    ctx.lineWidth = props.strokeWidth;
    ctx.strokeStyle = props.strokeColour;

    const diam = radius * 2;
    const makeCircles = circleFactory(ctx, radius, ringNum, makeCircle);

    const cols = 1 + Math.ceil(width / radius);
    const rows = 2 + Math.ceil((height * 2) / radius);

    for (let j = 0; j < rows; j++) {
      const y = j * (radius / 2);
      const offset = j % 2 === 0 ? 0 : radius;
      for (let i = 0; i < cols; i++) {
        const x = i * diam + offset;
        makeCircles(x, y);
      }
    }
  }
}
