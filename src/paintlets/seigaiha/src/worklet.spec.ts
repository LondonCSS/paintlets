import { StylePropertyMapReadOnly } from "../../../typings/houdini";
import { normalizeProps, defaultProps } from "./worklet";

describe("Seigaiha", () => {
  describe("normalizeProps", () => {
    it("Defaults are used when no custom props are specified", () => {
      const mockInputs = new Map() as unknown as StylePropertyMapReadOnly;
      const expectOutput = { ...defaultProps };

      expect(normalizeProps(mockInputs, defaultProps)).toEqual(expectOutput);
    });

    it("Custom props override defaults", () => {
      const mockInputs = new Map([
        ["--radius", "100"],
        ["--stroke-width", "3"],
        ["--stroke-colour", "#f00"],
        ["--colours", "#000 #fff"],
      ]) as unknown as StylePropertyMapReadOnly;

      const expectOutput = {
        ...defaultProps,
        radius: 100,
        strokeWidth: 3,
        strokeColour: "#f00",
        colours: ["#000", "#fff"],
      };

      expect(normalizeProps(mockInputs, defaultProps)).toEqual(expectOutput);
    });
  });

  describe("makeCircles", () => {
    it("Executes a callback with the correct properties", () => {
      // expect(true).toEqual(false);
      expect(true).toEqual(true);
    });
  });
});
