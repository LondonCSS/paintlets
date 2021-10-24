<script>
  export let config;

  function parseConfig(config) {
    let controls = [];
    for (const [k, v] of Object.entries(config)) {
      if (v.controls?.type === "color") continue;

      controls.push({
        id: v.key,
        name: k,
        value: v.value,
        controls: v.controls,
      });
    }
    return controls;
  };

  $: controls = parseConfig(config);
</script>

<form action="#" class="sample__controls">
  {#each controls as { id, name, value, controls }}
    <label for={id}>{name}</label>
    <input {id} {name} {value} {...controls} />
  {/each}
</form>

<style lang="scss">
  .sample__controls {
    grid-area: 1/-1/-1/-2;
    align-self: end;
    justify-self: end;

    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 0.5rem;

    margin: 1rem;
    padding: 1rem;
    color: #fff;
    background: #000a;

    & label {
      text-align: right;
    }
  }
</style>
