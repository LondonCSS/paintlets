import "../_lib/styles.scss";

async function init() {
  if (CSS["paintWorklet"] === undefined) {
    await import("https://unpkg.com/css-paint-polyfill");
  }

  if (import.meta.env.PROD) {
    const workletURL = await import("./dist/paintlet-hexo.es.js?url");
    CSS.paintWorklet.addModule(workletURL.default);
  } else {
    CSS.paintWorklet.addModule("./src/index.ts");
  }
}

init();
