<script>
  import Controls from "./paintlet-controls.svelte";

  export let paintlet = "";
  export let config = {};
  export let sampleNum = 0;

  function onSampleHover(event) {
    const el = event.target;
    let _cls = "";
    for (const cls of el.classList.values()) {
      _cls += " " + cls;
    }
    demoCls = "sample__demo " + _cls;
  }

  function getSampleClasses(length) {
    return Array.from({ length }, (_, idx) => {
      return `${paintlet} ${paintlet}--${idx + 1}`;
    });
  }

  function onControlsUpdate(event) {
    const { name, value } = event.target;
    demoStyle[name] = value;
  }

  function parseStyles(demoStyle) {
    const styles = [];
    for (const key in demoStyle) {
      styles.push(`${key}: ${demoStyle[key]};`);
    }
    return styles.join(" ");
  }

  let sampleClasses = getSampleClasses(sampleNum);
  let demoCls = "sample__demo " + sampleClasses[0];
  let demoStyle = {};

  $: styles = parseStyles(demoStyle);
</script>

<div class="samples">
  <ul class="sample__nav">
    {#each sampleClasses as sampleCls}
      <li class={`sample ${sampleCls}`} on:mouseover={onSampleHover} on:focus={onSampleHover} />
    {/each}
  </ul>
  <div class={demoCls} style={styles}><slot /></div>
  <Controls {config} onInput={onControlsUpdate} />
</div>

<style lang="scss">
  .samples {
    --nav-w: 200px;

    display: grid;
    background-color: #111;

    height: 100%;

    @media (min-width: 768px) {
      grid-template-columns: var(--nav-w) 1fr;
    }
  }

  .sample__nav {
    display: grid;
    gap: 1rem;

    margin: 0;
    padding: 1rem;
    list-style: none;
    background-color: #000;
  }

  .sample {
    overflow: hidden;
    border-radius: 0.5rem;

    background-image: var(--bg-image);
    background-color: var(--bg);
  }

  .sample__demo {
    grid-area: 1/-1/-1/-2;

    display: none;
    border-radius: 0;
    background-color: var(--bg);
    background-image: var(--bg-image);

    @media (min-width: 768px) {
      display: block;
    }
  }
</style>
