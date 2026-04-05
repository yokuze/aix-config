---
paths:
  - "**/*.css"
  - "**/*.scss"
---

* Always use SCSS, not CSS
* If using a component library, use the component's existing props or built-in options
  over custom styling. Reuse appropriate CSS classes
* If none are available, prefer pre-existing utility classes over custom styling
* Avoid ad-hoc CSS unless absolutely necessary
* Consider adding a custom utility class to the global SCSS if a pattern is used in
  multiple places (e.g. text truncation, screen reader text, grid patterns)
* Use CSS logical properties: `margin-inline-start`, not `margin-left`;
  `text-align: start`, not `text-align: left`
* Use CSS variables for theme-able values

## ABSOLUTELY DO NOT

* DO NOT use `@extend`
* DO NOT override `line-height` to values other than `1` unless you have a very good
   reason

## SCSS API

If the project auto-injects SCSS namespaces via its build config (e.g. Vite's
`css.preprocessorOptions`), these are generally libraries and you should prefer these
mixins/vars/functions over hard-coded values.

Check the project's `vite.config.ts` or equivalent to see what is available.

## Style Block Structure

Vue components have **two** optional `<style>` blocks:

   1. A **non-scoped** block for CSS custom property (theme variable) definitions
   2. A **scoped** block for all component-specific styling

## Theming

### CSS custom property naming

Follow a consistent naming pattern for theme variables:

```text
--<namespace>-<component>-<property>
--<namespace>-<component>-<subComponentOrVariant>-<property>--<state>
```

Examples: `--button-fill-color`, `--button-fill-bgColor--hover`,
`--toggle-bgColor--active`, `--chip-borderColor--selected`

If the project uses a namespace prefix (e.g. `app-`), include it:
`--app-button-fill-color`, `--app-toggle-bgColor--active`

### Theme layers

When supporting light/dark mode with explicit theme classes, define variables in three
places for full coverage:

   1. `:root, .theme--light { ... }` — light mode (explicit opt-in and default)
   2. `.theme--dark { ... }` — dark mode (explicit opt-in)
   3. `@media (prefers-color-scheme: dark) { :root:not(.theme--light) { ... } }` —
      system-preference dark mode

## Naming Conventions (BEM-like with SCSS)

   * **Block**: the component root class, matching the component name in camelCase (e.g.
     `.card`, `.progressBar`, `.toggle`). Projects may use a namespace prefix (e.g.
     `.app-card`)
   * **Element**: hyphen-separated from the block (e.g. `.card-body`, `.card-title`,
     `.button-label`)
   * **Modifier**: double-hyphen suffix (e.g. `.button--disabled`,
     `.card--layout-horizontal`, `.chip--selected`)

Use SCSS `&` nesting to compose these:

```scss
.card {
   &-body {
      &-primaryArea { /* .card-body-primaryArea */ }
   }
   &--disabled { /* .card--disabled */ }
}
```

### Exported CSS classes

When a component exposes slots that consumers may fill with custom content, export a
frozen object of CSS class names so consumers can apply the same styling:

```ts
export const cardCSSClasses = Object.freeze({
   cardPrimaryArea: 'card-body-primaryArea',
   cardTitle: 'card-title',
});
```

Pass these to slots via `v-bind`:

```vue
<slot name="title" v-bind="{ title, className: cardCSSClasses.cardTitle }" />
```

Limit exported class names to those required for styling slotted content or test
assertions.

## Property Ordering

```scss
.className {
   // Positioning
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
   background: #000000;
   color: #ffffff;

   // Text
   font-family: sans-serif;
   font-size: 16px;
   line-height: 1.4;
   text-align: right;

   // Everything else
   cursor: pointer;
}
```

## Scoped Style Patterns

### `:deep()`

Use `:deep()` to style slotted or child-component content from a scoped parent:

```scss
:deep(.card-title) { font-weight: 400; }
:deep(> .icon) { flex-shrink: 0; }
```

### `v-bind()` in CSS

Vue's `v-bind()` can reference reactive values from `<script setup>` in `<style scoped>`
blocks:

```ts
const aspectRatio = ref('16 / 9');
```

```scss
.thumbnail {
   aspect-ratio: v-bind(aspectRatio);
}
```

## Responsive Design

   * No fixed pixel breakpoints. Components should rely on Flexbox, CSS Grid, and
     container-relative sizing
   * Use `@media (hover: hover)` or a project-provided hover mixin when giving a
     component hover styles that should not show on touch-only devices
   * Use `prefers-reduced-motion: reduce` to disable animations where appropriate
   * Consider whether a component's text should be user-selectable. Use
     `user-select: none` for button-like interactive elements

## SCSS Syntax

   * Use `@use` and `@forward`. Do not use `@import`
   * Use `sass:map`, `sass:list`, etc. via `@use 'sass:map' as map;`
   * Prefer the modern Dart Sass compiler API (`api: 'modern-compiler'` in Vite config)
   * CSS Modules (`.module.scss`) should only be used for demo/story styling, not in
     library components. Use `:global()` within a module file to target third-party
     data attributes
