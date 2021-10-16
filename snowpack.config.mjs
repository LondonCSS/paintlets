export default {
  alias: {
    $lib: "./lib",
    $paintlets: "./paintlets",
  },
  packageOptions: {
    rollup: {
      input: "./lib/noop.js",
    },
  },
};
