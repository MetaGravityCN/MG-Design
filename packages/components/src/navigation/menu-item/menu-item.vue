<template>
  <button
    v-bind="$attrs"
    type="button"
    role="menuitem"
    :class="['mg-menu-item', { 'is-active': active, 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="context?.select(index)"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { menuContextKey } from '../menu/context'
defineOptions({ name: 'MgMenuItem', inheritAttrs: false })
const props = defineProps<{
  index: string
  disabled?: boolean
  route?: string | Record<string, unknown>
}>()
const context = inject(menuContextKey)
const active = computed(() => context?.active() === props.index)
</script>
<style scoped>
.mg-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  padding: 0 20px;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.mg-menu-item:not(:disabled):hover {
  background: var(--mg-color-fill-light, #f5f6f7);
}
.mg-menu-item.is-active {
  color: var(--mg-menu-active-color, #0052d9);
  background: var(--mg-color-primary-light-9, #f2f3ff);
}
.mg-menu-item:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.mg-menu-item:focus-visible { outline: none; box-shadow: inset var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-menu-item:not(:disabled):active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-menu--horizontal > .mg-menu-item {
  width: auto;
  border-bottom: 2px solid transparent;
}
.mg-menu--horizontal > .mg-menu-item.is-active {
  background: transparent;
  border-bottom-color: currentColor;
}
</style>
