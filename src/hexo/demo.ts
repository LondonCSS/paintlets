import { init } from "../_lib/demo";

init("hexo");

const customProps = ["--style", "--radius", "--hue", "--gap", "--stroke-width", "--stroke-colour"];

document.addEventListener("click", (event) => {
  const el = event.target as HTMLElement;
  const li = el?.closest("li");
  if (li) {
    const props: Record<string, unknown> = {};
    for (const prop of customProps) {
      const computedProp = getComputedStyle(li).getPropertyValue(prop);
      if (computedProp) {
        props[prop] = computedProp;
      }
    }
    console.log(props);
  }
});
