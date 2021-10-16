type Props = {
  li: HTMLElement | null;
  demo: HTMLElement | null;
  classes: Set<string>;
};

function applyClasses({ li, demo, classes }: Props) {
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
export function demoSampleOnHover(): void {
  const demo = document.querySelector(".sample__demo") as HTMLElement;
  const li = document.querySelector(".sample__nav li") as HTMLElement;
  const lis = document.querySelectorAll(".sample__nav li");
  const classes: Set<string> = new Set();

  for (const li of lis) {
    for (const cls of li.classList.values()) {
      classes.add(cls);
    }
  }

  document.addEventListener("mouseover", (event) => {
    const el = event.target as HTMLElement;
    const li = el?.closest("li");
    applyClasses({ li, demo, classes });
  });

  // Auto select the first example on load
  applyClasses({ li, demo, classes });
}
