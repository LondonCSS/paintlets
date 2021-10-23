export const defaultProps = {
  "--seed": {
    key: "seed",
    value: Math.floor(Math.random() * 100),
    parseAs: "number",
  },
  "--style": {
    key: "style",
    value: "overlay",
    parseAs: "string",
    controls: {
      type: "select",
      options: ["rainbow", "rainbow-stroke", "hue", "overlay"],
    },
  },
  "--radius": {
    key: "radius",
    value: 16,
    parseAs: "int",
    controls: {
      type: "number",
      min: 4,
      step: 1,
    },
  },
  "--gap": {
    key: "gap",
    value: 0,
    parseAs: "float",
    controls: {
      type: "number",
      step: 1,
    },
  },
  "--fill": {
    key: "fill",
    value: "",
    parseAs: "string",
    controls: {
      type: "color",
    },
  },
  "--stroke-width": {
    key: "strokeWidth",
    value: 0,
    parseAs: "float",
    controls: {
      type: "number",
      min: 0,
      step: 1,
    },
  },
  "--stroke-colour": {
    key: "strokeColour",
    value: "#fff",
    parseAs: "string",
    controls: {
      type: "color",
    },
  },
  "--cube-tints": {
    key: "cubeTints",
    parseAs: "colours",
    controls: {
      type: "color",
    },
  },
  "--scale": {
    key: "scale",
    value: 0.001,
    parseAs: "float",
    controls: {
      type: "number",
      step: 0.001,
    },
  },
} as const;
