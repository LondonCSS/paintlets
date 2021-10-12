import { StylePropertyMapReadOnly } from "../../../../../typings/houdini";
import { normaliseInput } from "../../../../_lib/utils";
import { Truchet } from "../worklet";

describe("Truchet", () => {
  describe("normalizeProps", () => {
    it("Defaults are used when no custom props are specified", () => {
      const mockInputs = new Map() as unknown as StylePropertyMapReadOnly;
      const expectOutput = {
        lineWidth: 1,
        seed: 1,
        strokeStyle: "#fff",
        tileSize: 50,
      };

      expect(normaliseInput(mockInputs, Truchet)).toEqual(expectOutput);
    });

    it("Custom props override defaults", () => {
      const mockInputs = new Map([
        ["--seed", "100"],
        ["--tile-size", "40"],
        ["--stroke-width", "1"],
        ["--stroke-colour", "#f00"],
      ]) as unknown as StylePropertyMapReadOnly;

      const expectOutput = {
        seed: 100,
        tileSize: 40,
        lineWidth: 1,
        strokeStyle: "#f00",
      };

      expect(normaliseInput(mockInputs, Truchet)).toEqual(expectOutput);
    });
  });
});
