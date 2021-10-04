import * as houdini from "../../../typings/houdini";
import { PointXY, Tile, TileProps } from "../types";

import { parseInput } from "../../_lib/utils";

type DefaultProps = typeof defaultProps;
type InputKey = typeof inputProps[number];
type InputRecord = Record<InputKey, string>;

export const inputProps = ["--seed", "--stroke-width", "--stroke-colour", "--tile-size"] as const;
export const defaultProps = {
  seed: 1,
  tileSize: 50,
  lineWidth: 3,
  strokeStyle: "#fff",
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

export function normalizeProps(
  rawProps: houdini.StylePropertyMapReadOnly,
  opts: DefaultProps
): DefaultProps {
  const props = {} as InputRecord;
  for (const [key, value] of rawProps.entries()) {
    props[key as InputKey] = value.toString().trim();
  }

  return {
    seed: parseInput(props["--seed"], opts.seed, "int") as number,
    tileSize: parseInput(props["--tile-size"], opts.tileSize, "int") as number,
    lineWidth: parseInput(props["--stroke-width"], opts.lineWidth, "float") as number,
    strokeStyle: parseInput(props["--stroke-colour"], opts.strokeStyle) as string,
  };
}

export class Truchet implements houdini.PaintCtor {
  static inputProperties = inputProps;

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    props: houdini.StylePropertyMapReadOnly
  ): void {
    const { strokeStyle, lineWidth, seed, tileSize } = normalizeProps(props, defaultProps);
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
