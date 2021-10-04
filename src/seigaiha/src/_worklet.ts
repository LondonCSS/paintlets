import * as houdini from "../../../typings/houdini";

import { parseInput } from "@londoncss/paintlet-utils";

type DefaultProps = typeof defaultProps;
type InputKey = typeof inputProps[number];
type InputRecord = Record<InputKey, string>;

export const inputProps = ["--radius", "--stroke-width", "--stroke-colour", "--colours"] as const;
export const defaultProps = {
  radius: 55,
  strokeWidth: 0.5,
  strokeColour: "#b6b58e",
  // colours: ["#202237", "#0b605f"],
  // colours: ["#0b605f", "#202237"],
  colours: ["#0b605f", "#402132"],
};

function makeCircle(ctx: houdini.PaintRenderingContext2D, x: number, y: number, radius: number): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

// TODO Pass in pre-calculated Math.PI * 2, radii and a makeCircle function
export function makeCircles(
  ctx: houdini.PaintRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colour: string
): void {
  ctx.fillStyle = colour;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  makeCircle(ctx, x, y, radius * 0.2);
  makeCircle(ctx, x, y, radius * 0.4);
  makeCircle(ctx, x, y, radius * 0.6);
  makeCircle(ctx, x, y, radius * 0.8);
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
    radius: parseInput(props["--radius"], opts.radius, "int") as number,
    colours: parseInput(props["--colours"], opts.colours, "colours") as string[],
    strokeWidth: parseInput(props["--stroke-width"], opts.strokeWidth, "float") as number,
    strokeColour: parseInput(props["--stroke-colour"], opts.strokeColour) as string,
  };
}

export class Seigaiha implements houdini.PaintCtor {
  static get inputProperties(): typeof inputProps {
    return inputProps;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {PaintSize} size
   * @param {StylePropertyMapReadOnly} rawProps
   */
  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normalizeProps(rawProps, defaultProps);
    const [colourA, colourB] = props.colours;
    const iterationsX = width / props.radius / 2;
    const iterationsY = ((height + props.radius * 2) / props.radius) * 2;
    const xGap = props.radius * 2;

    // TODO make 7 less of a magic number: use radius * 0.8
    // TODO clamp values so that Infinity isn't possible
    // TODO Make center a configurable option


    const yGap = (height + props.radius * 2) / iterationsY - 5;
    let center = Math.round(iterationsX / 2);
    let x: number;
    let y: number;
    let colour: string;
    let random: number;

    ctx.strokeStyle = props.strokeColour;
    ctx.lineWidth = props.strokeWidth;

    for (let col = 0; col <= iterationsY; col++) {
      for (let row = 0; row <= iterationsX; row++) {
        x = xGap * row;
        y = yGap * col;
        colour = row == Math.round(center) ? colourB : colourA;

        if (col % 2 == 0) x += props.radius;

        makeCircles(ctx, x, y, props.radius, colour);
      }

      if (col % 2 == 0) {
        if (center > iterationsX * 0.25) {
          random = Math.random() > 0.5 ? 0 : 1;
        } else {
          random = 1;
        }
      } else {
        if (center < iterationsX * 0.75) {
          random = Math.random() > 0.5 ? -1 : 0;
        } else {
          random = -1;
        }
      }

      center += random;
    }
  }
}
