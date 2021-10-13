import * as houdini from "../../typings/houdini";

// TODO extract into typings
interface DefaultProp {
  key: string;
  value: string | number | string[];
  parseAs: ParserKey;
}
class PaintletCls {
  static inputProperties: string[];
  static defaultProperties: Record<string, DefaultProp>;
}

export type ParserKey = keyof typeof parsers;

export function convertPropsToObject(props: Record<string, DefaultProp>) {
  const obj: Record<string, DefaultProp["value"]> = {};
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
    // Split colour lists on spaces
    // Use a negative lookbehind to target spaces that aren't preceded by a comma
    // e.g. "hsl(100, 100%, 50%) hsl(200, 50%, 25%)" is only 2 values
    return str?.split(/(?<!,)\s/gi);
  },
} as const;

export function normaliseInput<T>(
  rawProps: houdini.StylePropertyMapReadOnly,
  Paintlet: PaintletCls
): T {
  const testProps = {} as T;

  for (const inputKey of Paintlet.inputProperties) {
    const { key, value, parseAs } = Paintlet.defaultProperties[inputKey];
    const parse = parsers[parseAs as ParserKey];
    if (rawProps.has(inputKey)) {
      const val = rawProps.get(inputKey)?.toString().trim() || "";
      testProps[key] = val?.length > 0 ? parse(val) : value;
    } else {
      testProps[key] = value;
    }
  }

  return testProps;
}
