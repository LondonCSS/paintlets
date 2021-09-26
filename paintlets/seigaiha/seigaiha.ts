import * as houdini from "../../typings/houdini";

type DefaultProps = typeof defaultProps;

const inputProperties = [
  "--radius",
  "--stroke-width",
  "--stroke-color",
  "--colours",
];

const defaultProps = {
  radius: 50,
  strokeWidth: 0.5,
  strokeColour: "#b6b58e",
  // colours: ["#202237", "#0b605f"],
  // colours: ["#0b605f", "#202237"],
  colours: ["#0b605f", "#402132"],
};

function makeCircle(
  ctx: houdini.PaintRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

function makeCircles(
  ctx: houdini.PaintRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  ctx.fillStyle = color;

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

function normalizeProps(
  rawProps: houdini.StylePropertyMapReadOnly,
  opts: DefaultProps
): DefaultProps {
  const props = {} as DefaultProps;
  for (const [k, v] of rawProps.entries()) {
    const value = v.toString();
    const isSet = value.length > 0;

    switch (k) {
      case "--radius":
        props.radius = isSet ? parseInt(value, 10) : opts.radius;
        break;

      case "--stroke-width":
        props.strokeWidth = isSet ? parseFloat(value) : opts.strokeWidth;
        break;

      case "--stroke-color":
        props.strokeColour = isSet ? value.trim() : opts.strokeColour;
        break;

      case "--colours":
        props.colours = isSet
          ? value.split(",").map((s: string) => s.trim())
          : opts.colours;
        break;
    }
  }

  return props;
}

export class Seigaiha implements houdini.PaintCtor {
  static get inputProperties() {
    return inputProperties;
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
  ) {
    const props = normalizeProps(rawProps, defaultProps);
    const [colourA, colourB] = props.colours;

    const iterationsX = width / props.radius / 2;
    const iterationsY = (height / props.radius) * 2;
    const xGap = props.radius * 2;

    // TODO make 7 less of a magic number: use radius * 0.8
    const yGap = (height + props.radius * 2) / iterationsY - 7;
    let center = Math.round(iterationsX / 2);
    let x: number, y: number, colour: string, random: number;

    ctx.strokeStyle = props.strokeColour;
    ctx.lineWidth = props.strokeWidth;

    for (var col = 0; col <= iterationsY; col++) {
      for (var row = 0; row <= iterationsX; row++) {
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

(() => registerPaint("seigaiha", Seigaiha))();
