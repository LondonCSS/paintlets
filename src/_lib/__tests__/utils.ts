import { parsers } from "../utils";

describe("utils", () => {
  describe("normaliseInput", () => {
    describe("colours", () => {
      test.each([
        [undefined, undefined],
        ["red green blue", ["red", "green", "blue"]],
        ["#0b605f #402132", ["#0b605f", "#402132"]],
        [
          "hsl(100, 100%, 50%) hsl(200, 50%, 25%) hsl(300, 25%, 0)",
          ["hsl(100, 100%, 50%)", "hsl(200, 50%, 25%)", "hsl(300, 25%, 0)"],
        ],
        [
          "rgb(255,255,255) rgb(255,255,255,1) rgb(255,255,255,0.5) rgb(255,255,255,.5)",
          ["rgb(255,255,255)", "rgb(255,255,255,1)", "rgb(255,255,255,0.5)", "rgb(255,255,255,.5)"],
        ],
        [
          "red hsl(300, 25%, 0) rgba(255,255,255,.5) green blue",
          ["red", "hsl(300, 25%, 0)", "rgba(255,255,255,.5)", "green", "blue"],
        ],
      ])("%s", (input, expected) => {
        expect(parsers.colours(input)).toEqual(expected);
      });
    });
  });
});
