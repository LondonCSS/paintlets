import * as houdini from "../../../../typings/houdini";

import { normaliseInput } from "../../../_lib/utils";

const PI2 = Math.PI * 2;

export const defaultProps = {
  "--radius": {
    key: "radius",
    value: 55,
    parseAs: "int",
  },
  "--rings": {
    key: "ringNum",
    value: 5,
    parseAs: "int",
  },
  "--stroke-width": {
    key: "strokeWidth",
    value: 0.5,
    parseAs: "float",
  },
  "--stroke-colour": {
    key: "strokeColour",
    value: "#b6b58e",
    parseAs: "string",
  },
  "--colours": {
    key: "colours",
    value: ["#0b605f", "#402132"],
    parseAs: "colours",
  },
};

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

export class seigaiha implements houdini.PaintCtor {
  public static defaultProperties = defaultProps;
  public static inputProperties = Object.keys(seigaiha.defaultProperties);

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normaliseInput(rawProps, seigaiha.inputProperties, seigaiha.defaultProperties);
    const { radius, ringNum } = props;
    const [colourA] = props.colours;

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
