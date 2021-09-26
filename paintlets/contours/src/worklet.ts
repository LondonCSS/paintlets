import * as houdini from "../../../typings/houdini";

type Area = [number, number];
type Point = [number, number];
type PolyLine = Point[];
type Props = typeof defaultProps;
type PropKey = keyof Props;
type Transform = (v?: string) => string | number;

import SimplexNoise from "simplex-noise";
import { mapRange, linspace } from "canvas-sketch-util/math";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { isoBands } from "marchingsquares";

const simplex = new SimplexNoise();

const inputProps = ["--grid-unit", "--line-colour", "--line-width", "--line-frequency"];
const defaultProps = {
  gridUnit: 96 * 2,
  lineColour: "#fff",
  lineWidth: 0.1,
  lineFrequency: 12,
};

function drawShape([start, ...pts]: PolyLine) {
  return [start, ...pts, start];
}

function drawIsoLines(lineSpace: number, gridUnit: number) {
  return function (noiseData: PolyLine[], [sizeX, sizeY]: Area): PolyLine[] {
    const intervals = linspace(lineSpace, gridUnit);
    const lines: PolyLine[] = [];

    intervals.forEach((_: any, idx: number) => {
      if (idx > 0) {
        const lowerBand = intervals[idx - 1];
        const upperBand = intervals[idx];

        isoBands(noiseData, lowerBand, upperBand - lowerBand, {
          successCallback(bands: PolyLine[]) {
            bands.forEach((band: PolyLine) => {
              const scaledBand: PolyLine = band.map(([x, y]) => {
                return [
                  mapRange(x, 0, gridUnit - 1, 0, sizeX),
                  mapRange(y, 0, gridUnit - 1, 0, sizeY),
                ];
              });

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

export class Contours implements houdini.PaintCtor {
  static get inputProperties() {
    return inputProps;
  }

  paint(
    ctx: houdini.PaintRenderingContext2D,
    size: houdini.PaintSize,
    props: houdini.StylePropertyMapReadOnly
  ) {
    const { width, height } = size;

    const gridUnit = +(props.get("--grid-unit") || defaultProps.gridUnit);
    const lineWidth = +(props.get("--line-width") || defaultProps.lineWidth);
    const lineFrequency = +(props.get("--line-frequency") || defaultProps.lineFrequency);
    const lineColour = props.get("--line-colour")?.length > 0
      ? [...props.get("--line-colour")][0]
      : defaultProps.lineColour;

    console.log(props.get("--line-colour"));


    const noiseData: PolyLine[] = [];
    for (let y = 0; y < gridUnit; y++) {
      noiseData[y] = [];
      for (let x = 0; x < gridUnit; x++) {
        const _n = simplex.noise2D(x / (gridUnit * 0.75), y / (gridUnit * 0.75));

        const n = mapRange(_n, -1, 1, 0, 1);

        noiseData[y].push(n);
      }
    }

    const lines = drawIsoLines(lineFrequency, gridUnit)(noiseData, [width, height]);

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
