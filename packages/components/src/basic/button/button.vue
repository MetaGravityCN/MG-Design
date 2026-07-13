<template>
  <component
    :is="tag"
    ref="buttonRef"
    v-bind="$attrs"
    :type="tag === 'button' ? nativeType : undefined"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-disabled="tag !== 'button' && isDisabled ? 'true' : undefined"
    :aria-busy="loading || undefined"
    :autofocus="autofocus || undefined"
    :tabindex="tag !== 'button' && isDisabled ? -1 : undefined"
    :class="buttonClasses"
    :style="colorStyles"
    @click="handleClick"
  >
    <span v-if="loading" class="mg-button__spinner" aria-hidden="true" />
    <component :is="icon" v-else-if="icon" class="mg-button__icon" aria-hidden="true" />
    <span v-if="$slots.default" class="mg-button__content"><slot /></span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, type Component, type CSSProperties } from 'vue'

export type MgButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
export type MgButtonSize = 'large' | 'default' | 'small' | ''

defineOptions({ name: 'MgButton', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    size?: MgButtonSize
    type?: MgButtonType
    nativeType?: 'button' | 'submit' | 'reset'
    plain?: boolean
    text?: boolean
    bg?: boolean
    link?: boolean
    round?: boolean
    circle?: boolean
    loading?: boolean
    disabled?: boolean
    autofocus?: boolean
    icon?: Component
    color?: string
    dark?: boolean
    tag?: string | Component
  }>(),
  {
    size: '',
    type: '',
    nativeType: 'button',
    tag: 'button',
  }
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()
const buttonRef = ref<HTMLElement>()
const isDisabled = computed(() => props.disabled || props.loading)
const buttonClasses = computed(() => [
  'mg-button',
  props.type && `mg-button--${props.type}`,
  props.size && `mg-button--${props.size}`,
  {
    'is-plain': props.plain,
    'is-text': props.text,
    'is-bg': props.bg,
    'is-link': props.link,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-loading': props.loading,
    'is-disabled': isDisabled.value,
    'is-dark': props.dark,
  },
])
const colorStyles = computed<CSSProperties | undefined>(() =>
  props.color ? ({ '--mg-button-custom-color': props.color } as CSSProperties) : undefined
)

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}

defineExpose({ ref: buttonRef })
</script>

<style scoped>
.mg-button {
  --mg-button-color: var(--mg-button-custom-color, var(--mg-color-text-regular, #424a57));
  --mg-button-bg: var(--mg-color-white, #fff);
  --mg-button-border: var(--mg-color-border, #dcdde1);
  --mg-button-hover-color: var(--mg-color-primary, #0052d9);
  --mg-button-hover-bg: var(--mg-color-primary-light-9, #f2f3ff);
  --mg-button-hover-border: var(--mg-color-control-hover-border, #8eabff);
  --mg-button-active-color: var(--mg-color-primary-dark-2, #003cab);
  --mg-button-active-bg: var(--mg-color-primary-light-8, #d9e1ff);
  --mg-button-active-border: var(--mg-color-primary-active, #003cab);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 32px;
  height: 32px;
  padding: 0 15px;
  color: var(--mg-button-color);
  font: inherit;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  appearance: none;
  background: var(--mg-button-bg);
  border: 1px solid var(--mg-button-border);
  border-radius: var(--mg-border-radius-base, 3px);
  outline: none;
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.mg-button:not(.is-disabled):not(:disabled):hover {
  color: var(--mg-button-hover-color);
  background: var(--mg-button-hover-bg);
  border-color: var(--mg-button-hover-border);
}

.mg-button:not(.is-disabled):not(:disabled):active {
  color: var(--mg-button-active-color);
  background: var(--mg-button-active-bg);
  border-color: var(--mg-button-active-border);
}

.mg-button:focus-visible {
  border-color: var(--mg-button-hover-border);
  box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff);
}
.mg-button--primary {
  --mg-button-color: #fff;
  --mg-button-bg: var(--mg-color-primary, #0052d9);
  --mg-button-border: var(--mg-color-primary, #0052d9);
  --mg-button-hover-color: #fff;
  --mg-button-hover-bg: var(--mg-color-primary-hover, #618dff);
  --mg-button-hover-border: var(--mg-color-primary-hover, #618dff);
  --mg-button-active-color: #fff;
  --mg-button-active-bg: var(--mg-color-primary-active, #003cab);
  --mg-button-active-border: var(--mg-color-primary-active, #003cab);
}
.mg-button--success {
  --mg-button-color: #fff;
  --mg-button-bg: var(--mg-color-success, #2ba471);
  --mg-button-border: var(--mg-color-success, #2ba471);
  --mg-button-hover-color: #fff;
  --mg-button-hover-bg: var(--mg-color-success-hover, #56c08d);
  --mg-button-hover-border: var(--mg-color-success-hover, #56c08d);
  --mg-button-active-color: #fff;
  --mg-button-active-bg: var(--mg-color-success-active, #008858);
  --mg-button-active-border: var(--mg-color-success-active, #008858);
}
.mg-button--warning {
  --mg-button-color: #fff;
  --mg-button-bg: var(--mg-color-warning, #e37318);
  --mg-button-border: var(--mg-color-warning, #e37318);
  --mg-button-hover-color: #fff;
  --mg-button-hover-bg: var(--mg-color-warning-hover, #fa9550);
  --mg-button-hover-border: var(--mg-color-warning-hover, #fa9550);
  --mg-button-active-color: #fff;
  --mg-button-active-bg: var(--mg-color-warning-active, #be5a00);
  --mg-button-active-border: var(--mg-color-warning-active, #be5a00);
}
.mg-button--danger {
  --mg-button-color: #fff;
  --mg-button-bg: var(--mg-color-danger, #d54941);
  --mg-button-border: var(--mg-color-danger, #d54941);
  --mg-button-hover-color: #fff;
  --mg-button-hover-bg: var(--mg-color-danger-hover, #ff9285);
  --mg-button-hover-border: var(--mg-color-danger-hover, #ff9285);
  --mg-button-active-color: #fff;
  --mg-button-active-bg: var(--mg-color-danger-active, #ad352f);
  --mg-button-active-border: var(--mg-color-danger-active, #ad352f);
}
.mg-button--info {
  --mg-button-color: #fff;
  --mg-button-bg: var(--mg-color-info, #6f7686);
  --mg-button-border: var(--mg-color-info, #6f7686);
  --mg-button-hover-color: #fff;
  --mg-button-hover-bg: var(--mg-color-info-hover, #858a99);
  --mg-button-hover-border: var(--mg-color-info-hover, #858a99);
  --mg-button-active-color: #fff;
  --mg-button-active-bg: var(--mg-color-info-active, #535d6d);
  --mg-button-active-border: var(--mg-color-info-active, #535d6d);
}
.mg-button--large {
  min-width: 40px;
  height: 40px;
  padding: 0 19px;
}
.mg-button--small {
  min-width: 24px;
  height: 24px;
  padding: 0 11px;
  font-size: 12px;
}
.mg-button.is-round {
  border-radius: 999px;
}
.mg-button.is-circle {
  width: 32px;
  padding: 0;
  border-radius: 50%;
}
.mg-button--large.is-circle {
  width: 40px;
}
.mg-button--small.is-circle {
  width: 24px;
}
.mg-button.is-plain {
  --mg-button-hover-color: var(--mg-button-border);
  --mg-button-active-color: var(--mg-button-active-border);
  color: var(--mg-button-border);
  background: color-mix(in srgb, var(--mg-button-border) 10%, white);
}
.mg-button.is-text,
.mg-button.is-link {
  color: var(--mg-button-custom-color, var(--mg-color-primary, #0052d9));
  background: transparent;
  border-color: transparent;
}
.mg-button.is-text.is-bg {
  background: var(--mg-color-primary-light-9, #f2f3ff);
}
.mg-button.is-link {
  height: auto;
  min-width: 0;
  padding: 0;
}
.mg-button.is-disabled {
  cursor: not-allowed;
  opacity: var(--mg-opacity-disabled, 0.55);
}
.mg-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: mg-button-spin 0.8s linear infinite;
}
.mg-button__icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
@keyframes mg-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
