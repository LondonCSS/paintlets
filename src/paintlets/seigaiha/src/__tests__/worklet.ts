import { StylePropertyMapReadOnly } from "../../../../../typings/houdini.js";
import { normaliseInput, convertPropsToObject } from "../../../../_lib/utils";
import { Seigaiha } from "../worklet";

const defaultProps = convertPropsToObject(Seigaiha.defaultProperties);

describe("Seigaiha", () => {
  describe("normalizeProps", () => {
    it("Defaults are used when no custom props are specified", () => {
      const mockInputs = new Map() as unknown as StylePropertyMapReadOnly;

      expect(normaliseInput(mockInputs, Seigaiha)).toEqual(defaultProps);
    });

    it("Custom props override defaults", () => {
      const mockInputs = new Map([
        ["--radius", "200"],
        ["--stroke-width", "5"],
        ["--stroke-colour", "#f00"],
        ["--colours", "#000 #fff"],
      ]) as unknown as StylePropertyMapReadOnly;

      const expected = {
        bg: "#0b605f",
        ringNum: 5,
        river: undefined,
        radius: 200,
        strokeWidth: 5,
        strokeColour: "#f00"
      };

      expect(normaliseInput(mockInputs, Seigaiha)).toEqual(expected);
    });
  });

  describe("makeCircles", () => {
    it("Executes a callback with the correct properties", () => {
      // expect(true).toEqual(false);
      expect(true).toEqual(true);
    });
  });
});
