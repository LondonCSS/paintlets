// import "../scripts/demo";

async function init() {
  if (CSS["paintWorklet"] === undefined) {
    await import("https://unpkg.com/css-paint-polyfill");
  }

  if (import.meta.env.PROD) {
    CSS.paintWorklet.addModule("https://unpkg.com/@londoncss/paintlet-contour");
  } else {
    CSS.paintWorklet.addModule("../../../src/paintlets/contour/src/index.ts");
  }
}
