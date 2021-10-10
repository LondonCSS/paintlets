import * as houdini from "../../typings/houdini";

export type ParserKey = keyof typeof parsers;

// TODO: deprecate in favour of v2
const parsers = {
  int: (str: string, fallback: number): number => parseInt(str, 10) || fallback,
  float: (str: string, fallback: number): number => parseFloat(str) || fallback,
  string: (str: string, fallback: string): string => (str?.length > 0 ? str : fallback),
  colours: (str: string, fallback: string[]): string[] => {
    // Use a negative lookbehind to split on spaces that aren't preceded by a comma
    // e.g. "hsl(100, 100%, 50%) hsl(200, 50%, 25%)" is only 2 values
    return str?.length > 0 ? str.split(/(?<!,)\s/gi) : fallback;
  },
} as const;

const parsersV2 = {
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

export function parseInput(
  input: string,
  fallback: number | string | string[],
  type: ParserKey = "string"
): string | number | string[] {
  const parser = parsers[type];
  return parser(input, fallback as never);
}

export function normaliseInput(
  rawProps: houdini.StylePropertyMapReadOnly,
  inputProperties: string[],
  defaultProperties: {
    [key: string]: {
      key: string;
      value: string | number | string[];
      parseAs: ParserKey;
    };
  }
): Record<string, string | number | string[]> {
  const testProps = {};
  for (const inputKey of inputProperties) {
    const { key, value, parseAs } = defaultProperties[inputKey];
    const parse = parsersV2[parseAs];
    if (rawProps.has(inputKey)) {
      const val = rawProps.get(inputKey)?.toString().trim() || "";
      testProps[key] = val?.length > 0 ? parse(val) : value;
    } else {
      testProps[key] = value;
    }
  }

  return testProps;
}
