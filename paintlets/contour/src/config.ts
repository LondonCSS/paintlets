export const defaultProps = {
  "--seed": {
    key: "seed",
    value: Math.floor(Math.random() * 100),
    parseAs: "number",
  },
  "--grid-unit": {
    key: "gridUnit",
    value: 192,
    parseAs: "int",
    controls: {
      type: "number",
      min: 64,
      max: 512,
    },
  },
  "--line-colour": {
    key: "lineColour",
    value: "#ffffff",
    parseAs: "string",
    controls: {
      type: "color",
    },
  },
  "--line-width": {
    key: "lineWidth",
    value: 0.1,
    parseAs: "float",
    controls: {
      type: "number",
      min: 0,
      max: 10,
      step: 0.1,
    },
  },
  "--line-frequency": {
    key: "lineFrequency",
    value: 12,
    parseAs: "int",
    controls: {
      type: "number",
      min: 0,
      max: 100,
    },
  },
} as const;