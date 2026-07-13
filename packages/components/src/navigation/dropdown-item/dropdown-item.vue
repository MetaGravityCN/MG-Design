<template>
  <li :class="['mg-dropdown-item-wrap', { 'is-divided': divided }]" role="none">
    <button
      v-bind="$attrs"
      class="mg-dropdown-item"
      type="button"
      role="menuitem"
      :disabled="disabled"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @click="handleClick"
    >
      <span v-if="icon" class="mg-dropdown-item__icon" aria-hidden="true">
        <component :is="icon" v-if="typeof icon !== 'string'" />
        <template v-else>{{ icon }}</template>
      </span>
      <slot />
    </button>
  </li>
</template>

<script setup lang="ts">
import { inject, type Component } from 'vue'
import { mgDropdownKey } from '../dropdown/context'

defineOptions({ name: 'MgDropdownItem', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    command?: unknown
    disabled?: boolean
    divided?: boolean
    icon?: string | Component
  }>(),
  { disabled: false, divided: false }
)
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const dropdown = inject(mgDropdownKey, undefined)
function handleClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
  dropdown?.select(props.command, event)
}
</script>

<style scoped>
.mg-dropdown-item-wrap {
  margin: 0;
  padding: 0;
}
.mg-dropdown-item-wrap.is-divided {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--mg-border-color-lighter, #edf0f5);
}
.mg-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 34px;
  padding: 7px 16px;
  color: var(--mg-color-text-regular, #4e5669);
  font: inherit;
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: 0;
  outline: none;
}
.mg-dropdown-item:not(.is-disabled):hover,
.mg-dropdown-item:focus-visible {
  color: var(--mg-color-primary, #0052d9);
  background: var(--mg-color-primary-light-9, #f2f3ff);
}
.mg-dropdown-item:not(.is-disabled):active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-dropdown-item:disabled {
  color: var(--mg-color-text-placeholder, #a6abb6);
  cursor: not-allowed;
  background: transparent;
}
.mg-dropdown-item__icon {
  display: inline-flex;
}
</style>
