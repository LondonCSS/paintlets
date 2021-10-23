interface Props {
  controlForm: HTMLFormElement;
  demoPanel: HTMLElement;
  defaultProps: any;
}

function getHTML(props) {
  let html = "";
  for (const [k, v] of Object.entries(props)) {
    if (v.controls) {
      const { type, min, max, step = 1 } = v.controls;
      if (type === "color") {
        console.log("avoiding color");
      } else {
        html += `
          <label for=${v.key}>${k}</label>
          <input name=${k} value="${v.value}" type=${type} id=${v.key} min=${min} max=${max} step=${step}>
        `;
      }
    }
  }
  return html;
}

export function makeControls({ controlForm, demoPanel, defaultProps }: Props) {
  // Apply Custom Property to the demo panel
  controlForm.addEventListener("change", (e) => {
    demoPanel.style.setProperty(e.target.name, e.target.value);
  });

  // Respond to changes to demoPanel's classlist
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const cs = getComputedStyle(demoPanel);
        for (const key of Object.keys(defaultProps)) {
          if (controlForm.elements[key]) {
            controlForm.elements[key].value = cs.getPropertyValue(key).trim();
          }
        }
      }
    });
  });
  mutationObserver.observe(demoPanel, { attributes: true });

  controlForm.innerHTML = getHTML(defaultProps);
}
