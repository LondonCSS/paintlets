import * as houdini from "../../../../typings/houdini";

import { parseInput } from "../../../_lib/utils";

type Area = [number, number];
type Point = [number, number];
type PolyLine = Point[];

type DefaultProps = typeof defaultProps;
type InputKey = typeof inputProps[number];
type InputRecord = Record<InputKey, string>;

import SimplexNoise from "simplex-noise";
import { mapRange, linspace } from "canvas-sketch-util/math";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { isoBands } from "marchingsquares";

export const inputProps = [
  "--grid-unit",
  "--line-colour",
  "--line-width",
  "--line-frequency",
] as const;

export const defaultProps = {
  gridUnit: 192,
  lineColour: "#fff",
  lineWidth: 0.1,
  lineFrequency: 12,
};

function drawShape([start, ...pts]: PolyLine) {
  return [start, ...pts, start];
}

function getIsoLineFn(intervals: number[], gridUnit: number, [sizeX, sizeY]: Area) {
  return function (noiseData: PolyLine[]): PolyLine[] {
    const lines: PolyLine[] = [];

    intervals.forEach((_: number, idx: number) => {
      if (idx > 0) {
        const lowerBand = intervals[idx - 1];
        const upperBand = intervals[idx];

        isoBands(noiseData, lowerBand, upperBand - lowerBand, {
          successCallback(bands: PolyLine[]) {
            bands.forEach((band: PolyLine) => {
              const scaledBand: PolyLine = band.map(([x, y]) => [
                mapRange(x, 0, gridUnit - 1, 0, sizeX),
                mapRange(y, 0, gridUnit - 1, 0, sizeY),
              ]);

              lines.push(drawShape(scaledBand));
            });
          },
          noQuadTree: true,
          noFrame: true,
        });
      }
    });

    return clipPolylinesToBox(lines, [0, 0, sizeX, sizeY]);
  };
}

function makeNoise(simplex: SimplexNoise, gridUnit: number): PolyLine[] {
  const noiseData: PolyLine[] = [];
  for (let y = 0; y < gridUnit; y++) {
    noiseData[y] = [];
    for (let x = 0; x < gridUnit; x++) {
      const _n = simplex.noise2D(x / (gridUnit * 0.75), y / (gridUnit * 0.75));
      const n = mapRange(_n, -1, 1, 0, 1);
      noiseData[y].push(n);
    }
  }

  return noiseData;
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
    gridUnit: parseInput(props["--grid-unit"], opts.gridUnit, "int") as number,
    lineWidth: parseInput(props["--line-width"], opts.lineWidth, "float") as number,
    lineFrequency: parseInput(props["--line-frequency"], opts.lineFrequency, "int") as number,
    lineColour: parseInput(props["--line-colour"], opts.lineColour) as string,
  };
}

export class Contour implements houdini.PaintCtor {
  public static inputProperties = inputProps;
  public static defaultProperties = defaultProps;

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const { gridUnit, lineWidth, lineFrequency, lineColour } = normalizeProps(
      rawProps,
      defaultProps
    );
    const simplex = new SimplexNoise();

    const intervals = linspace(lineFrequency, gridUnit);
    const drawIsoLines = getIsoLineFn(intervals, gridUnit, [width, height]);

    const noiseData = makeNoise(simplex, gridUnit);
    const lines = drawIsoLines(noiseData);

    ctx.strokeStyle = lineColour;
    ctx.lineWidth = lineWidth;

    lines.forEach(([start, ...pts]: PolyLine) => {
      ctx.beginPath();
      ctx.moveTo(...start);
      pts.forEach((pt) => ctx.lineTo(...pt));
      ctx.stroke();
    });
  }
}
