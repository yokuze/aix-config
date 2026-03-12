---
trigger: glob
globs: "**/*.vue"
---

   * Assume Vue version 3.5+ unless you see otherwise in package.json
   * Use Vue 3 composition API, SFCs
   * Prefer composition using slots over props when it makes sense
   * Be aware of the different kinds of components: Page-level, layout, UI components that
     contain no business logic, and business-logic-level components
   * Use VueUse as much as possible
   * For styling:
      * Use SCSS
      * Use scoped styles
      * Look at ./css-scss.md

Follow this block order:

```vue
<template>
   <div class="myComponent">
      <slot />
   </div>
</template>

<script lang="ts">
// Any TypeScript types or constants that are needed outside of the component
export interface MyComponentProps {
   label: string;
}
</script>

<script setup lang="ts">
const props = defineProps<MyComponentProps>();
</script>

<style lang="scss">
/* theme variables */
:root {
   --myComponent-bgColor: #aaa;
}
</style>

<style lang="scss" scoped>
/* component styles */
</style>
```
