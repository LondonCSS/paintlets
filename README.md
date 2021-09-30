# paintlets

A collection of Houdini paintlets as featured on [paintlets.londoncss.dev](https://paintlets.londoncss.dev)

## Contour

!["3 square divs with different Contour patterns"](assets/localhost_3000_examples_contours.html.png)

## Truchet

!["3 square divs with different Truchet patterns"](assets/localhost_3000_examples_truchet.html.png)
## Seigaiha

!["3 square divs with different Seigaiha patterns"](assets/localhost_3000_examples_seigaiha.html.png)

---

## Development

1. ```pnpm i```
1. ```pnpm dev```
1. Visit one of
    - http://localhost:3000/examples/contour.html
    - http://localhost:3000/examples/truchet.html
    - http://localhost:3000/examples/seigaiha.html

Examples are live: changes made to the paintlet source are immediately reflected in the example page via HMR

## TODO

### Paintlets
- [ ] Standardise how to read in props

### Infra
- [x] Build process for all paintlets
- [x] Create common vite.config.js that reads in from package.json
- [ ] Limit TS linting to TS files

### Publish
- [ ] Create an examples/index.html listing
- [ ] Make /examples the source of /build
- [ ] Add DATgui config and make styles configurable & exportable
- [ ] Use component.ai API for gradients
- [ ] Host at paintlets.londoncss.dev
