export type ParserKey = keyof typeof parsers;

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

export function parseInput(
  input: string,
  fallback: number | string | string[],
  type: ParserKey = "string"
): string | number | string[] {
  const parser = parsers[type];
  return parser(input, fallback as never);
}
