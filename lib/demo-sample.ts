type SampleProps = {
  sample: HTMLElement | null;
  demoPanel: HTMLElement | null;
  classes: Set<string>;
  clearStyle?: boolean;
};

function applyClasses({ sample, demoPanel, classes, clearStyle = false }: SampleProps) {
  if (sample && demoPanel) {
    demoPanel.classList.remove(...classes);
    for (const cls of sample.classList.values()) {
      demoPanel.classList.add(cls);
    }
    if (clearStyle) {
      demoPanel.style.cssText = "";
    }
  }
}

/**
 * Apply .sample classes to the .sample__demo element on hover or click
 */
interface Props {
  demoPanel: HTMLElement | null;
  samples: NodeListOf<HTMLElement>;
}
export function applySampleStyles({ demoPanel, samples }: Props): void {
  const classes: Set<string> = new Set();

  for (const sample of samples) {
    for (const cls of sample.classList.values()) {
      classes.add(cls);
    }
  }

  document.addEventListener("mouseover", (event) => {
    const el = event.target as HTMLElement;
    const sample = el?.closest("li");
    applyClasses({ sample, demoPanel, classes });
  });

  document.addEventListener("click", (event) => {
    const el = event.target as HTMLElement;
    const sample = el?.closest("li");
    applyClasses({ sample, demoPanel, classes, clearStyle: true });
  });

  // Auto select the first example on load
  applyClasses({ sample: samples[0], demoPanel, classes, clearStyle: true });
}
