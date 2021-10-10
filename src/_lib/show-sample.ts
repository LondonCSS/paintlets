export function showSample(paintletName: string, sampleProps: string[]): void {
  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);

  document.addEventListener("mouseover", (event) => {
    const el = event.target as HTMLElement;
    const li = el?.closest("li");
    if (li) {
      const props: Record<string, string> = {
        "background-image": `paint(${paintletName})`,
      };
      for (const prop of sampleProps) {
        const computedProp = getComputedStyle(li).getPropertyValue(prop);
        if (computedProp) {
          props[prop] = computedProp.trim();
        }
      }

      styleEl.innerHTML = `
        .sample__demo {
          ${Object.entries(props)
            .map(([prop, value]) => `${prop}: ${value};`)
            .join("\n")}
        }
      `;
    }
  });
}
