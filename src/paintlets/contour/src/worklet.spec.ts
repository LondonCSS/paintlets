import { StylePropertyMapReadOnly } from "../../../../typings/houdini";
import { normalizeProps } from "./worklet";

const mockDefaults = {
  gridUnit: 192,
  lineColour: "#fff",
  lineWidth: 0.1,
  lineFrequency: 12,
};

describe("Contour", () => {
  describe("normalizeProps", () => {
    it("Defaults are used when no custom props are specified", () => {
      const mockInputs = new Map() as unknown as StylePropertyMapReadOnly;
      const expectOutput = { ...mockDefaults };

      expect(normalizeProps(mockInputs, mockDefaults)).toEqual(expectOutput);
    });

    it("Custom props override defaults", () => {
      const mockInputs = new Map([
        ["--grid-unit", "64"],
        ["--line-colour", "#fffa"],
        ["--line-width", "0.5"],
        ["--line-frequency", "16"],
      ]) as unknown as StylePropertyMapReadOnly;

      const expectOutput = {
        gridUnit: 64,
        lineColour: "#fffa",
        lineWidth: 0.5,
        lineFrequency: 16,
      };

      expect(normalizeProps(mockInputs, mockDefaults)).toEqual(expectOutput);
    });
  });
});
