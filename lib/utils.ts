import * as houdini from "../typings/houdini";

// TODO extract into typings
interface PaintletProp {
  key: string;
  value: string | number | string[];
  parseAs: ParserKey;
}
class PaintletCls {
  static inputProperties: string[];
  static defaultProperties: Record<string, PaintletProp>;
}

export type ParserKey = keyof typeof parsers;

export function convertPropsToObject(props: Record<string, PaintletProp>) {
  const obj: Record<string, PaintletProp["value"]> = {};
  for (const val of Object.values(props)) {
    obj[val.key] = val.value;
  }

  return obj;
}

export const parsers = {
  int: (str: string): number => parseInt(str, 10),
  float: (str: string): number => parseFloat(str),
  string: (str: string): string => str,
  colours: (str: string): string[] => {
    try {
      // Split colour lists on spaces
      // Use a negative lookbehind to target spaces that aren't preceded by a comma
      // e.g. "hsl(100, 100%, 50%) hsl(200, 50%, 25%)" is only 2 values
      const regex = /(?<!,)\s/gi;
      return str?.split(regex);
    } catch (err) {
      // Safari doesn't support negative lookbehind
      return str?.replaceAll(/,\s/g, ",").split(" ");
    }
  },
} as const;

export function normaliseInput(rawProps: houdini.StylePropertyMapReadOnly, Paintlet: PaintletCls) {
  const props = {} as Record<string, PaintletProp["value"]>;

  for (const inputKey of Paintlet.inputProperties) {
    const { key, value, parseAs } = Paintlet.defaultProperties[inputKey] as PaintletProp;
    const parse = parsers[parseAs as ParserKey];
    if (rawProps.has(inputKey)) {
      const val = rawProps.get(inputKey)?.toString().trim() || "";
      props[key] = val?.length > 0 ? parse(val) : value;
    } else {
      props[key] = value;
    }
  }

  return props;
}
