import type * as houdini from "../../../../typings/houdini";

import { createNoise2D } from "simplex-noise";

import { normaliseInput } from "../../../_lib/utils";

interface FillProps {
	h: string;
	s: string;
	l: string;
	a: string;
}

interface PaintletProps {
	style: string;
	radius: number;
	gap: number;
	fill: string;
	strokeWidth: number;
	strokeColour: string;
	cubeTints: [string, string, string];
  scale?: number;
}

interface HexProps {
	x: number;
	y: number;
	rad: number;
}

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
	"--cube-tints": {
		key: "cubeTints",
		parseAs: "colours",
	},
	"--scale": {
		key: "scale",
		value: 0.001,
		parseAs: "float",
	},
};

const ANGLE = (2 * Math.PI) / 6;

const hslRegex = /hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,?\s?(\d*\.?\d+)?\)/g;

function parseFill(fill: string): FillProps | undefined {
	if (fill.length) {
		const [h, s, l, a] = [...fill.matchAll(hslRegex)][0].slice(1);
		return { h, s, l, a };
	}
}

function getHexPath({ x, y, rad }: HexProps) {
	const path = new Path2D();
	for (let i = 0; i < 6; i++) {
		path.lineTo(x + rad * Math.cos(ANGLE * i), y + rad * Math.sin(ANGLE * i));
	}
	path.closePath();

	return path;
}

function getCubeFaces({ x, y, rad }: HexProps): [Path2D, Path2D, Path2D] {
	const leftFace = new Path2D();
	leftFace.lineTo(x + rad * Math.cos(ANGLE * 3), y + rad * Math.sin(ANGLE * 3));
	leftFace.lineTo(x + rad * Math.cos(ANGLE * 4), y + rad * Math.sin(ANGLE * 4));
	leftFace.lineTo(x + rad * Math.cos(ANGLE * 5), y + rad * Math.sin(ANGLE * 5));
	leftFace.lineTo(x, y);
	leftFace.closePath();

	const topFace = new Path2D();
	topFace.lineTo(x + rad * Math.cos(ANGLE * 1), y + rad * Math.sin(ANGLE * 1));
	topFace.lineTo(x + rad * Math.cos(ANGLE * 2), y + rad * Math.sin(ANGLE * 2));
	topFace.lineTo(x + rad * Math.cos(ANGLE * 3), y + rad * Math.sin(ANGLE * 3));
	topFace.lineTo(x, y);
	topFace.closePath();

	const rightFace = new Path2D();
	rightFace.lineTo(x + rad * Math.cos(ANGLE * 5), y + rad * Math.sin(ANGLE * 5));
	rightFace.lineTo(x + rad * Math.cos(ANGLE * 0), y + rad * Math.sin(ANGLE * 0));
	rightFace.lineTo(x + rad * Math.cos(ANGLE * 1), y + rad * Math.sin(ANGLE * 1));
	rightFace.lineTo(x, y);
	rightFace.closePath();

	return [leftFace, topFace, rightFace];
}

/**
 * Create a layer varying the hue
 */
function rainbow(n: number) {
	const h = Math.floor((300 * (n - 1)) / 2);
	const hsl = `hsl(${h}, 50%, 70%)`;
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
	{ style, fill, strokeWidth }: PaintletProps
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

function drawCubeFaces(
	[leftFace, rightFace, topFace]: [Path2D, Path2D, Path2D],
	[leftFill, rightFill, topFill]: [string, string, string],
	ctx: houdini.PaintRenderingContext2D
) {
	ctx.fillStyle = topFill;
	ctx.fill(topFace);

	ctx.fillStyle = leftFill;
	ctx.fill(leftFace);

	ctx.fillStyle = rightFill;
	ctx.fill(rightFace);
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
		// TODO make normaliseInput generic
		const props = normaliseInput(rawProps, Hexo) as PaintletProps;
		const drawPath = drawPathFn(ctx, props);

		const { radius: r, gap, strokeWidth, strokeColour, cubeTints, scale } = props;

		const noise2D = createNoise2D();
		const rMin = r * Math.sin(ANGLE);
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
				const hexProps = {
					x,
					y: y + yOff,
					rad: r - gap,
				};

				const hexPath = getHexPath(hexProps);
				const n = noise2D(scale * x, scale * y) + 1;
				drawPath(hexPath, n);

				if (cubeTints) {
					const cubePaths = getCubeFaces(hexProps);
					drawCubeFaces(cubePaths, cubeTints, ctx);
				}
			}
		}
	}
}
