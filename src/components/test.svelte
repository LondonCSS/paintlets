<script>
  export let worklet = "";

  $: console.log({ worklet });

  // console.log({ defaultProps });

  /*
  import "/scripts/demo-sample.js";

  import "../../lib/styles.scss";
  import { applySampleStyles } from ;
  import { makeControls } from "../../lib/demo-controls.ts";
  import { defaultProps } from "./src/worklet";

  const demoPanel = document.querySelector("[data-component='demo']");
  const controlForm = document.querySelector("[data-component='controls']");
  const samples = document.querySelectorAll(".sample__nav .sample");

  makeControls({ controlForm, demoPanel, defaultProps });
  applySampleStyles({ demoPanel, samples });
  */
</script>
