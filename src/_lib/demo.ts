import "./styles.scss";

export async function init(paintletId: string): Promise<void> {
  if (CSS["paintWorklet"] === undefined) {
    await import("https://unpkg.com/css-paint-polyfill");
  }

  if (import.meta.env.PROD) {
    const workletURL = await import(`./dist/paintlet-${paintletId}.es.js?url`);
    CSS.paintWorklet.addModule(workletURL.default);
  } else {
    CSS.paintWorklet.addModule("./src/index.ts");
  }
}
