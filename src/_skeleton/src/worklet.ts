import * as houdini from "../../../typings/houdini";

import { parseInput } from "../../_lib/utils";

type InputKey = typeof inputProps[number];
type DefaultProps = typeof defaultProps;
type InputRecord = Record<InputKey, string>;

export const inputProps = [] as const;
export const defaultProps = {};

export function normalizeProps(
  rawProps: houdini.StylePropertyMapReadOnly,
  opts: DefaultProps
): DefaultProps {
  const props = {} as InputRecord;
  for (const [key, value] of rawProps.entries()) {
    props[key as InputKey] = value.toString().trim();
  }

  console.log({ opts, props });

  return props as DefaultProps;
}

export class Hexo implements houdini.PaintCtor {
  public static inputProperties = inputProps;

  paint(
    ctx: houdini.PaintRenderingContext2D,
    { width, height }: houdini.PaintSize,
    rawProps: houdini.StylePropertyMapReadOnly
  ): void {
    const props = normalizeProps(rawProps, defaultProps);
    console.log({ ctx, width, height, props });
  }
}
