export const defaultProps = {
  "--seed": {
    key: "seed",
    value: 1,
    parseAs: "int",
  },
  "--tile-size": {
    key: "tileSize",
    value: 50,
    parseAs: "int",
    controls: {
      type: "number",
      step: 1,
    },
  },
  "--stroke-width": {
    key: "lineWidth",
    value: 1,
    parseAs: "float",
    controls: {
      type: "number",
      step: 0.1,
    },
  },
  "--stroke-colour": {
    key: "strokeStyle",
    value: "#fff",
    parseAs: "string",
    controls: {
      type: "color"
    }
  },
} as const;
