---
paths:
  - "**/*.vue"
---

Assume Vue 3.5+ with the Composition API and Single-File Components (SFCs) unless
`package.json` indicates otherwise.

## ABSOLUTELY DO NOT

* ABSOLUTELY DO NOT use `v-html` in Vue templates; use `v-html-content` directive instead
  (sanitizes via DOMPurify)

## SFC Structure

Every component follows this block order:

   1. `<template>`
   2. `<script lang="ts">` — type/interface exports and constants (no `setup`)
   3. `<script setup lang="ts">` — component logic
   4. `<style lang="scss">` — global (non-scoped) CSS variables for theme support
   5. `<style lang="scss" scoped>` — scoped component styles

The dual `<script>` block pattern ensures TypeScript interfaces and exported constants are
available to consumers without requiring `<script setup>`.

```vue
<template>
   <div class="myComponent">
      <slot />
   </div>
</template>

<script lang="ts">
export interface MyComponentProps {
   label: string;
}
</script>

<script setup lang="ts">
const props = defineProps<MyComponentProps>();
</script>

<style lang="scss">
/* theme variables (non-scoped so theme switching works globally) */
</style>

<style lang="scss" scoped>
/* component styles */
</style>
```

Usage:

```ts
import { MyComponentProps }, MyComponent from './MyComponent.vue';
```

## Props

### TypeScript interface props (preferred)

Define a TypeScript interface in the non-setup `<script>` block and reference it with
`defineProps<T>()`:

```vue
<script lang="ts">
export interface ButtonProps {
   disabled?: boolean;
   appearance?: 'subdued' | 'link' | 'outline' | 'fill';
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ButtonProps>(), {
   disabled: false,
   appearance: 'subdued',
});
</script>
```

### Discriminated union props

When a component has mutually-exclusive prop combinations, define separate interfaces and
combine them with a union type. Use `never` to exclude invalid combinations:

```ts
export interface IconOnlyButtonProps extends BaseButtonProps {
   icon: IconName;
   label?: never;
   ariaLabel: string; // Required when no visible label
}

export interface LabelOnlyButtonProps extends BaseButtonProps {
   icon?: never;
   label: string;
   ariaLabel?: string;
}

export type ButtonProps = IconOnlyButtonProps | LabelOnlyButtonProps;
```

### `defineModel`

For v-model bindings, use `defineModel` (Vue 3.4+):

```ts
const modelValue = defineModel<boolean>({ default: false });
```

In the template:

```vue
<SwitchRoot v-model="modelValue" />
```

## Emits

Unlike props and slots interfaces, emits may be defined inline:

```ts
defineEmits<{
   'update:selected': [value: boolean];
   select: [event: Event];
}>();
```

## Slots

Define slot types in the non-setup `<script>` block and register them with `defineSlots`:

```vue
<script lang="ts">
export interface CardSlots {
   default?: never;
   actions?: () => unknown;
   title?: (props: { title: string; className: string }) => unknown;
}
</script>

<script setup lang="ts">
defineSlots<CardSlots>();
</script>
```

### Slot props

Pass CSS classes and internal state to slot consumers via `v-bind`:

```vue
<slot v-bind="{ cssClasses: buttonCSSClasses }">
   <!-- default content -->
</slot>

<slot name="title" v-bind="{ title, className: cardCSSClasses.cardTitle, id: titleID }">
   <h3 :id="titleID" :class="cardCSSClasses.cardTitle">{{ title }}</h3>
</slot>
```

### Checking slot existence

Use `useSlots()` or `$slots` to conditionally render wrapper elements:

```ts
const slots = useSlots();
```

```vue
<div v-if="$slots.actions" class="card-actions">
   <slot name="actions" />
</div>
```

## VueUse

Use `@vueuse/core` (and `@vueuse/components` if installed) instead of raw browser APIs.
VueUse composables handle lifecycle cleanup automatically and are SSR-safe.

| Instead of | Use |
| --- | --- |
| `addEventListener` / `removeEventListener` | `useEventListener()` |
| `setTimeout` / `clearTimeout` | `useTimeoutFn()` |
| `setInterval` / `clearInterval` | `useIntervalFn()` |
| `new ResizeObserver()` | `useResizeObserver()` |
| `new IntersectionObserver()` | `useIntersectionObserver()` |
| `window.matchMedia()` | `useMediaQuery()` |
| Manual scroll position tracking | `useScroll()` |
| `lodash.debounce` / hand-rolled debounce | `useDebounceFn()` |
| `getComputedStyle` / manual CSS var reads | `useCssVar()` |

Other commonly used composables: `onClickOutside()`, `useElementSize()`, `useFocusTrap()`,
`useVModel()`.

## Template Refs

Use `useTemplateRef` (Vue 3.5+):

```ts
const thumbnail = useTemplateRef<typeof Thumbnail>('thumbnail');
```

## Component Composition

### Dynamic element rendering

Use `<component :is="...">` to switch between element types based on props:

```ts
const elementType = computed(() => {
   return props.href ? 'a' : 'button';
});
```

```vue
<component :is="elementType" v-bind="attrs">
   <slot />
</component>
```

If using a headless component library (e.g. Reka UI, Radix Vue), consider its
`<Primitive>` component for root-level elements — it provides `asChild` for composability
without extra wrapper elements in the DOM.

### `inheritAttrs`

When a component needs manual control over where `$attrs` are applied, disable automatic
attribute inheritance and spread attrs explicitly:

```ts
defineOptions({ inheritAttrs: false });
```

```vue
<template>
   <div>
      <button v-bind="{ ...$attrs, onClick: undefined }" />
   </div>
</template>
```

## Exports

### Component index

Every component should be exported from the component index with both a named default
export and a wildcard re-export (for types):

```ts
export * from './Button.vue';
export { default as Button } from './Button.vue';
```

### Type exports

Export all public interfaces, type aliases, and constants from the non-setup `<script>`
block so consumers can import them alongside the component.

## Accessibility

* All interactive components must have appropriate ARIA attributes (`role`, `aria-label`,
   `aria-pressed`, `aria-disabled`, `tabindex`, etc.)
* Icon-only buttons require an `ariaLabel` prop (enforce at type level with discriminated
   unions)
* Use `<label for>` associations for form controls, or `aria-labelledby` when the label
   lives outside the component
* Screen-reader-only content uses a `.sr-only` utility class
* Support keyboard interaction (`@keydown.enter`, `@keydown.space`) alongside click
   handlers

## Server-Side Rendering (SSR)

If the component library must render in both browser and Node.js environments:

* Do not access `window`, `document`, `navigator`, or other browser globals at the top
   level of `<script setup>`. Guard behind `onMounted` or `typeof window !== 'undefined'`
* Prefer VueUse composables (SSR-safe by default)
* All custom directives must implement the `getSSRProps` hook so Vue's SSR renderer can
   produce correct attributes without mounting the directive in a DOM:

```ts
export const vMyDirective = {
   beforeMount(el, binding) {
      el.setAttribute('data-x', binding.value);
   },
   getSSRProps(binding) {
      return { 'data-x': binding.value };
   },
} satisfies ObjectDirective;
```

## Template Format

```vue
<ComponentName :prop-1="value" :prop-2="value" :long-prop-name="value" @event="handler">
</ComponentName>
```

## Browser Support

* Run `npx -y browserslist` to see the supported browser list if it's not documented
