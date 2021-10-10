const sampleProps = [
  "background-color",
  "background-image",
  "--style",
  "--radius",
  "--gap",
  "--fill",
  "--stroke-width",
  "--stroke-colour",
];

const styleEl = document.createElement("style");
document.head.appendChild(styleEl);

document.addEventListener("click", (event) => {
  const el = event.target as HTMLElement;
  const li = el?.closest("li");
  if (li) {
    const props: Record<string, string> = {
      "background-image": "paint(hexo)",
    };
    for (const prop of sampleProps) {
      const computedProp = getComputedStyle(li).getPropertyValue(prop);
      if (computedProp) {
        props[prop] = computedProp.trim();
      }
    }

    styleEl.innerHTML = `
      .bg {
        ${Object.entries(props)
          .map(([prop, value]) => `${prop}: ${value};`)
          .join("\n")}
      }
    `;
  }
});
