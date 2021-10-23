export const defaultProps = {
  "--radius": {
    key: "radius",
    value: 55,
    parseAs: "int",
    controls: {
      type: "number",
      step: 1,
    },
  },
  "--rings": {
    key: "ringNum",
    value: 5,
    parseAs: "int",
    controls: {
      type: "number",
      step: 1,
      min: 0,
    },
  },
  "--stroke-width": {
    key: "strokeWidth",
    value: 0.5,
    parseAs: "float",
    controls: {
      type: "number",
      step: 1,
      min: 0,
    }
  },
  "--stroke-colour": {
    key: "strokeColour",
    value: "#b6b58e",
    parseAs: "string",
    controls: {
      type: "color"
    }
  },
  "--bg": {
    key: "bg",
    value: "#0b605f",
    parseAs: "string",
    controls: {
      type: "color"
    }
  },
  "--river": {
    key: "river",
    parseAs: "string",
    controls: {
      type: "color"
    }
  },
};
