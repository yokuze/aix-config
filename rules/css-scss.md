---
trigger: glob
globs: "**/*.css,**/*.scss"
---

   * Use SCSS, not CSS when possible
   * If using a component library, use the component's existing props etc. over custom
     styling. Reuse appropriate CSS classes
   * Consider adding a custom utility class to the global CSS/SCSS if a pattern is used in
     multiple places, e.g. text truncation, screen-reader text, grid patterns
   * Use CSS logical properties: `margin-inline-start`, not `margin-left`
   * DO NOT use `@extend`

Use a BEM-like convention with SCSS nesting:

   * Block: the component root class, matching the component name in camelCase (e.g.
     `.card`, `.progressBar`)
   * Element: hyphen-separated from the block: `.card-body`, `.card-title`
   * Modifier: double-hyphen suffix: `.button--disabled`, `.card--layout-horizontal`

Use SCSS `&` nesting to compose these:

```scss
.card {
   &-body {
      &-primaryArea { /* .card-body-primaryArea */ }
   }
   &--disabled { /* .card--disabled */ }
}
```

Property ordering:

```scss
.className {
   // Positioning e.g.:
   position: absolute;
   z-index: 1;
   top: 0;
   inset-inline-end: 0;

   // Display / box model
   display: inline-block;
   overflow: hidden;
   width: 100px;
   padding: 10px;
   border-style: solid;
   margin: 10px;

   // Color
   background: #000;
   color: #fff

   // Text
   font-family: sans-serif;
   font-size: 16px;
   line-height: 1.4;
   text-align: right;

   // Everything else
   cursor: pointer;
}
```
