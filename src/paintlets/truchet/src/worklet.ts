import * as houdini from "../../../../typings/houdini";
import { PointXY, Tile, TileProps } from "../types";

import { normaliseInput } from "../../../_lib/utils";

type PaintletProps = {
  seed: number;
  tileSize: number;
  lineWidth: number;
  strokeStyle: string;
};

export const defaultProps = {
  "--seed": {
    key: "seed",
    value: 1,
    parseAs: "int",
  },
  "--tile-size": {
    key: "tileSize",
    value: 50,
    parseAs: "int",
  },
  "--stroke-width": {
    key: "lineWidth",
    value: 1,
    parseAs: "float",
  },
  "--stroke-colour": {
    key: "strokeStyle",
    value: "#fff",
    parseAs: "string",
  },
};

const K = (4 * (Math.sqrt(2) - 1)) / 3.0;
const KP = 1 - K;

const Point = (x: number, y: number): PointXY => ({ x, y });

/**
 * @param {number} seed
 * @returns {() => number}
 */
function RandomGenerator(seed: number): () => number {
  return function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

function generateCurve(
  p1: PointXY,
  p2: PointXY,
  p3: PointXY
): [number, number, number, number, number, number] {
  /**
   * @returns {[number, number]}
   */
  const cp1 = (): [number, number] => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return [p2.x - dx * KP, p2.y - dy * KP];
  };

  /**
   * @returns {[number, number]}
   */
  const cp2 = (): [number, number] => {
    const dx = p3.x - p2.x;
    const dy = p3.y - p2.y;
    return [p2.x + dx * KP, p2.y + dy * KP];
  };

  return [...cp1(), ...cp2(), p3.x, p3.y];
}

function drawTile(ctx: houdini.PaintRenderingContext2D, { x, y, w, h }: Tile, props: TileProps) {
  const p1 = Point(x + w / 2, y);
  const p2 = Point(x + w, y + h / 2);
  const p3 = Point(x + w / 2, y + h);
  const p4 = Point(x, y + h / 2);
  const p5 = Point(x + w / 2, y + h / 2);

  const arcs: [PointXY, PointXY, PointXY][] =
    props.random() < 0.5
      ? [
          [p1, p5, p2],
          [p4, p5, p3],
        ]
      : [
          [p2, p5, p3],
          [p4, p5, p1],
        ];

  arcs.forEach(function (arc) {
    const curve = generateCurve(...arc);
    ctx.beginPath();
    ctx.moveTo(arc[0].x, arc[0].y);
    ctx.bezierCurveTo(...curve);
    ctx.strokeStyle = props.strokeStyle;
    ctx.lineWidth = props.lineWidth;
    ctx.stroke();
    ctx.closePath();
  });
}

function getTile(x: number, y: number, tileSize: number): Tile {
  return {
    x: x * tileSize,
    y: y * tileSize,
    w: tileSize,
    h: tileSize,
  };
}

export class Truchet implements houdini.PaintCtor {
  public static defaultProperties = defaultProps;
  public static inputProperties = Object.keys(Truchet.defaultProperties);

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normaliseInput(rawProps, Truchet) as PaintletProps;
    const { strokeStyle, lineWidth, seed, tileSize } = props;
    const tileProps = {
      strokeStyle,
      lineWidth,
      random: RandomGenerator(seed),
    };

    for (let colIndex = 0; colIndex < width / tileSize; colIndex++) {
      for (let rowIndex = 0; rowIndex < height / tileSize; rowIndex++) {
        const tileXYWH = getTile(colIndex, rowIndex, tileSize);
        drawTile(ctx, tileXYWH, tileProps);
      }
    }
  }
}
