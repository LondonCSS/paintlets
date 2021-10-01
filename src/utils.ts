const parsers = {
  int: parseInt,
  float: parseFloat,
  string: (s: string) => s,
  colours: (cs: string) => cs.split(" "),
};

type ParserKey = keyof typeof parsers;

export function parseInput(input: string, fallback: unknown, type?: ParserKey): unknown {
  const parse = type ? parsers[type] : parsers.string;
  return input?.length > 0 ? parse(input) : fallback;
}
