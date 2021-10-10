import * as houdini from "../../typings/houdini";

export type ParserKey = keyof typeof parsers;

const parsers = {
  int: (str: string): number => parseInt(str, 10),
  float: (str: string): number => parseFloat(str),
  string: (str: string): string => str,
  colours: (str: string): string[] => {
    // Split colour lists on spaces
    // Use a negative lookbehind to target spaces that aren't preceded by a comma
    // e.g. "hsl(100, 100%, 50%) hsl(200, 50%, 25%)" is only 2 values
    return str.split(/(?<!,)\s/gi);
  },
} as const;

// TODO extract into typings
class PaintletCls {
  static inputProperties: string[]
  static defaultProperties: {
    [key: string]: {
      key: string;
      value: string | number | string[];
      parseAs: ParserKey;
    };
  }
}

export function normaliseInput(
  rawProps: houdini.StylePropertyMapReadOnly,
  paintlet: typeof PaintletCls
): Record<string, string | number | string[]> {
  const testProps = {} as Record<string, string | number | string[]>;
  for (const inputKey of paintlet.inputProperties) {
    const { key, value, parseAs } = paintlet.defaultProperties[inputKey];
    const parse = parsers[parseAs];
    if (rawProps.has(inputKey)) {
      const val = rawProps.get(inputKey)?.toString().trim() || "";
      testProps[key] = val?.length > 0 ? parse(val) : value;
    } else {
      testProps[key] = value;
    }
  }

  return testProps;
}
