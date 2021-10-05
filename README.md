# paintlets

A collection of Houdini paintlets as featured on https://paintlets.londoncss.dev

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
1. Visit http://localhost:3000/ and click tiles to see variants

Examples are live: changes made to the paintlet source are immediately reflected in the example page via HMR

## TODO

### Paintlets
- Patterns:
    - Hexo
    - Kumiko
    - Kumiko + Simplex
    - Vivrant
- Borders:
    - Bubbles
    - Futuristic
### Infra
- [ ] Limit TS linting to TS files
- [ ] Move example files into packages: src/<paintlet>/index.html
- [ ] Make file names less repetitive
- [ ] Add controls for parameters
- [x] Standardise how to read in props
- [x] Build process for all paintlets
- [x] Create common vite.config.js that reads in from package.json
- [x] Tests for all paintlets
    - [x] Contour
    - [x] Seigaiha
    - [x] Truchet

### Publish
- [ ] Make index.html generative?
- [x] Create an examples/index.html listing
- [x] Make /examples the source of /build
- [x] Host at paintlets.londoncss.dev
- [ ] Add DATgui config and make styles configurable & exportable
- [ ] Use component.ai API for gradients
- [ ] Dynamically generate example screenshots for README.md (via Github Actions?)
