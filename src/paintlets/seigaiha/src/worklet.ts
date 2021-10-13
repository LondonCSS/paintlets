import * as houdini from "../../../../typings/houdini";

import { normaliseInput } from "../../../_lib/utils";

const PI2 = Math.PI * 2;

type PaintletProps = {
  radius: number;
  ringNum: number;
  strokeWidth: number;
  strokeColour: string;
  bg: string;
  river: string;
};

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
  "--bg": {
    key: "bg",
    value: "#0b605f",
    parseAs: "string",
  },
  "--river": {
    key: "river",
    parseAs: "string",
  },
};

export function makeCircle(x: number, y: number, radii: number[]): Path2D {
  const rootPath = new Path2D();
  for (const r of radii) {
    const path = new Path2D();
    path.arc(x, y, r, 0, PI2);
    path.closePath();
    rootPath.addPath(path);
  }

  return rootPath;
}

// TODO return a path instead of updating the canvas directly
export function circleFactory(
  radius: number,
  ringNum: number,
  makeCircleFn: typeof makeCircle
): (x: number, y: number) => Path2D {
  const ringW = 1 / ringNum;
  const rings = [];
  let n = 1;
  while (n > 0) {
    rings.push(n);
    n -= ringW;
  }
  const radii = rings.map((r) => r * radius);

  return function makeCircles(x: number, y: number) {
    return makeCircleFn(x, y, radii);
  };
}

function getRiverIndexFn(cols: number): [number, (r: number, isEven: boolean) => number] {
  const min = Math.ceil(cols * 0.25);
  const max = Math.floor(cols * 0.75);
  const riverCols = max - min;
  const riverStart = Math.round(Math.random() * riverCols) + min;

  function getRiverIndex(r: number, isEven: boolean): number {
    const i = Math.random() > 0.5 ? (isEven ? 1 : 0) : isEven ? 0 : -1;
    const a = r + i;

    if (a < min) return a + 1;
    if (a > max) return a - 1;
    return a;
  }

  return [riverStart, getRiverIndex];
}

export class Seigaiha implements houdini.PaintCtor {
  public static defaultProperties = defaultProps;
  public static inputProperties = Object.keys(Seigaiha.defaultProperties);

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normaliseInput(rawProps, Seigaiha) as PaintletProps;
    const { bg, river, radius, ringNum } = props;

    ctx.lineWidth = props.strokeWidth;
    ctx.strokeStyle = props.strokeColour;

    const diam = radius * 2;
    const makeCircles = circleFactory(radius, ringNum, makeCircle);

    const cols = Math.ceil(width / (radius * 2));
    const rows = 2 + Math.ceil((height * 2) / radius);
    const [riverStart, getRiverIndex] = getRiverIndexFn(cols);

    let riverIndex = riverStart;
    for (let j = 0; j < rows; j++) {
      const y = j * (radius / 2);
      const isEven = j % 2 === 0;
      const offset = isEven ? 0 : radius;
      riverIndex = getRiverIndex(riverIndex, isEven);

      for (let i = 0; i < cols; i++) {
        const x = i * diam + offset;
        const path = makeCircles(x, y);

        ctx.fillStyle = river && i === riverIndex ? river : bg;
        ctx.fill(path);
        ctx.stroke(path);
      }
    }
  }
}
