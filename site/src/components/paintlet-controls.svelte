<script lang="ts">
  interface ConfigVal {
    key: string;
    value: unknown;
    controls: {
      type: string;
      label: string;
      options?: {
        key: string;
        value: unknown;
      }[];
    };
  }
  type Config = Record<string, ConfigVal>

  export let config: Config;
  export let onInput: svelte.JSX.FormEventHandler<HTMLFormElement>;

  function parseConfig(config: Config): any[] {
    let _controls = [];
    for (const [name, val] of Object.entries(config)) {
      // TODO: support colour, options, etc
      if (!val.controls) continue;
      if (val.controls.type === "color") continue;

      // TODO change key to id: will allow pushing val directly into _controls
      const { key: id, value, controls } = val;
      _controls.push({ id, name, value, controls });
    }

    return _controls;
  }

  $: controls = parseConfig(config);
</script>

<form action="#" class="sample__controls" on:input={onInput}>
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
