function applyClasses({ li, demo, classes }) {
  if (li && demo) {
    demo.classList.remove(...classes);
    for (const cls of li.classList.values()) {
      demo.classList.add(cls);
    }
  }
}

/**
 * Apply .sample classes to the .sample__demo element on hover
 */
export function demoSampleOnHover() {
  const demo = document.querySelector(".sample__demo");
  const li = document.querySelector(".sample__nav li");
  const lis = document.querySelectorAll(".sample__nav li");
  const classes = new Set();

  for (const li of lis) {
    for (const cls of li.classList.values()) {
      classes.add(cls);
    }
  }

  document.addEventListener("mouseover", (event) => {
    const el = event.target;
    const li = el?.closest("li");
    applyClasses({ li, demo, classes });
  });

  // Auto select the first example on load
  applyClasses({ li, demo, classes });
}

demoSampleOnHover();
