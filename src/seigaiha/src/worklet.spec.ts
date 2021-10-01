import { StylePropertyMapReadOnly } from "../../../typings/houdini";
import { normalizeProps } from "./worklet";

const mockDefaults = {
  radius: 50,
  strokeWidth: 0.5,
  strokeColour: "#b6b58e",
  colours: ["#0b605f", "#402132"],
};

describe("Seigaiha", () => {
  describe("normalizeProps", () => {
    it("Defaults are used when no custom props are specified", () => {
      const mockInputs = new Map() as unknown as StylePropertyMapReadOnly;
      const expectOutput = { ...mockDefaults };

      expect(normalizeProps(mockInputs, mockDefaults)).toEqual(expectOutput);
    });

    it("Custom props override defaults", () => {
      const mockInputs = new Map([
        ["--radius", "100"],
        ["--stroke-width", "3"],
        ["--stroke-colour", "#f00"],
        ["--colours", "#000 #fff"],
      ]) as unknown as StylePropertyMapReadOnly;

      const expectOutput = {
        ...mockDefaults,
        radius: 100,
        strokeWidth: 3,
        strokeColour: "#f00",
        colours: ["#000", "#fff"],
      };

      expect(normalizeProps(mockInputs, mockDefaults)).toEqual(expectOutput);
    });
  });
});
