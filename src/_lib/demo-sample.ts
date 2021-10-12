export function demoSampleOnHover(): void {
  const demo = document.querySelector(".sample__demo");
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
    if (li && demo) {
      demo.classList.remove(...classes);
      for (const cls of li.classList.values()) {
        demo.classList.add(cls);
      }
    }
  });
}
