<template>
  <a
    v-bind="$attrs"
    :class="linkClasses"
    :href="disabled ? undefined : href"
    :target="disabled ? undefined : target"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="handleClick"
  >
    <component :is="icon" v-if="icon" class="mg-link__icon" aria-hidden="true" />
    <span v-if="$slots.default" class="mg-link__content"><slot /></span>
  </a>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

export type MgLinkType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
export type MgLinkUnderline = boolean | 'always' | 'hover' | 'never'

defineOptions({ name: 'MgLink', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    type?: MgLinkType
    underline?: MgLinkUnderline
    disabled?: boolean
    href?: string
    target?: string
    icon?: Component
  }>(),
  { type: 'default', underline: 'hover' }
)
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const linkClasses = computed(() => [
  'mg-link',
  `mg-link--${props.type}`,
  {
    'is-disabled': props.disabled,
    'is-underline-always': props.underline === true || props.underline === 'always',
    'is-underline-hover': props.underline === 'hover',
  },
])

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.mg-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--mg-color-text-regular, #424a57);
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  outline: none;
}
.mg-link:not(.is-disabled):hover,
.mg-link:focus-visible {
  color: var(--mg-color-primary, #0052d9);
}
.mg-link:not(.is-disabled):active { color: var(--mg-color-primary-active, #003cab); }
.mg-link:focus-visible {
  border-radius: 2px;
  box-shadow: 0 0 0 2px var(--mg-color-primary-light-8, #d9e1ff);
}
.mg-link--primary {
  color: var(--mg-color-primary, #0052d9);
}
.mg-link--success {
  color: var(--mg-color-success, #2ba471);
}
.mg-link--warning {
  color: var(--mg-color-warning, #e37318);
}
.mg-link--danger {
  color: var(--mg-color-danger, #d54941);
}
.mg-link--info {
  color: var(--mg-color-info, #6f7686);
}
.mg-link.is-underline-always,
.mg-link.is-underline-hover:not(.is-disabled):hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.mg-link.is-disabled {
  color: var(--mg-color-text-placeholder, #a2a6b1);
  cursor: not-allowed;
}
.mg-link__icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
