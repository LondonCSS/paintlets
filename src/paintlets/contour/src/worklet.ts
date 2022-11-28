import type * as houdini from "../../../../typings/houdini";
import type { NoiseFunction2D } from "simplex-noise";

type Area = [number, number];
type Point = [number, number];
type PolyLine = Point[];

import { createNoise2D } from "simplex-noise";
import { mapRange, linspace } from "canvas-sketch-util/math";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { isoBands } from "marchingsquares";

import { normaliseInput } from "../../../_lib/utils";

type PaintletProps = {
	gridUnit: number;
	lineColour: string;
	lineWidth: number;
	lineFrequency: number;
};

export const defaultProps = {
	"--grid-unit": {
		key: "gridUnit",
		value: 192,
		parseAs: "int",
	},
	"--line-colour": {
		key: "lineColour",
		value: "#fff",
		parseAs: "string",
	},
	"--line-width": {
		key: "lineWidth",
		value: 0.1,
		parseAs: "float",
	},
	"--line-frequency": {
		key: "lineFrequency",
		value: 12,
		parseAs: "int",
	},
} as const;

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

function makeNoise(noise2D: NoiseFunction2D, gridUnit: number): PolyLine[] {
	const noiseData: PolyLine[] = [];
	for (let y = 0; y < gridUnit; y++) {
		noiseData[y] = [];
		for (let x = 0; x < gridUnit; x++) {
			const _n = noise2D(x / (gridUnit * 0.75), y / (gridUnit * 0.75));
			const n = mapRange(_n, -1, 1, 0, 1);
			noiseData[y].push(n);
		}
	}

	return noiseData;
}

export class Contour implements houdini.PaintCtor {
	public static defaultProperties = defaultProps;
	public static inputProperties = Object.keys(Contour.defaultProperties);

	paint(
		ctx: houdini.PaintRenderingContext2D,
		{ width, height }: houdini.PaintSize,
		rawProps: houdini.StylePropertyMapReadOnly
	): void {
		const props = normaliseInput(rawProps, Contour) as PaintletProps;
		const { gridUnit, lineWidth, lineFrequency, lineColour } = props;

		const noise2D = createNoise2D();

		const intervals = linspace(lineFrequency, gridUnit);
		const drawIsoLines = getIsoLineFn(intervals, gridUnit, [width, height]);

		const noiseData = makeNoise(noise2D, gridUnit);
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
