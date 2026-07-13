<template>
  <button
    ref="buttonRef"
    v-bind="$attrs"
    type="button"
    role="switch"
    :aria-checked="isActive"
    :disabled="isDisabled"
    :class="classes"
    :style="switchStyle"
    @click="toggle"
    @keydown.left.prevent="set(false)"
    @keydown.right.prevent="set(true)"
  >
    <span v-if="!inlinePrompt && inactiveText" class="mg-switch__label mg-switch__label--left"
      ><slot name="inactive">{{ inactiveText }}</slot></span
    >
    <span class="mg-switch__track"
      ><span v-if="inlinePrompt" class="mg-switch__prompt"
        ><slot :name="isActive ? 'active' : 'inactive'">{{
          isActive ? activeText : inactiveText
        }}</slot></span
      ><span class="mg-switch__thumb"
        ><span v-if="loading" class="mg-switch__spinner" /><slot
          v-else
          :name="isActive ? 'active-action' : 'inactive-action'" /></span
    ></span>
    <span v-if="!inlinePrompt && activeText" class="mg-switch__label mg-switch__label--right"
      ><slot name="active">{{ activeText }}</slot></span
    >
  </button>
</template>
<script setup lang="ts">
import { computed, inject, ref, type CSSProperties } from 'vue'
import { formContextKey, formItemContextKey } from '@mg-design/primitives'
type SwitchValue = boolean | string | number
defineOptions({ name: 'MgSwitch', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: SwitchValue
    disabled?: boolean
    loading?: boolean
    size?: 'large' | 'default' | 'small'
    activeText?: string
    inactiveText?: string
    inlinePrompt?: boolean
    activeValue?: SwitchValue
    inactiveValue?: SwitchValue
    activeColor?: string
    inactiveColor?: string
    width?: number | string
    validateEvent?: boolean
    beforeChange?: () => boolean | Promise<boolean>
  }>(),
  { modelValue: false, activeValue: true, inactiveValue: false, validateEvent: true }
)
const emit = defineEmits<{
  'update:modelValue': [value: SwitchValue]
  change: [value: SwitchValue]
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const buttonRef = ref<HTMLButtonElement>()
const changing = ref(false)
const isActive = computed(() => Object.is(props.modelValue, props.activeValue))
const isDisabled = computed(() =>
  Boolean(props.disabled || props.loading || changing.value || form?.disabled?.value)
)
const classes = computed(() => [
  'mg-switch',
  props.size && `mg-switch--${props.size}`,
  {
    'is-checked': isActive.value,
    'is-disabled': isDisabled.value,
    'is-loading': props.loading,
    'is-inline-prompt': props.inlinePrompt,
  },
])
const switchStyle = computed<CSSProperties>(
  () =>
    ({
      '--mg-switch-width': typeof props.width === 'number' ? `${props.width}px` : props.width,
      '--mg-switch-active': props.activeColor,
      '--mg-switch-inactive': props.inactiveColor,
    }) as CSSProperties
)
async function set(active: boolean) {
  if (isDisabled.value || active === isActive.value) return
  changing.value = true
  try {
    if (props.beforeChange && !(await props.beforeChange())) return
    const value = active ? props.activeValue : props.inactiveValue
    emit('update:modelValue', value)
    emit('change', value)
    if (props.validateEvent) void formItem?.validate('change')
  } finally {
    changing.value = false
  }
}
function toggle() {
  void set(!isActive.value)
}
defineExpose({ focus: () => buttonRef.value?.focus(), checked: isActive })
</script>
<style scoped>
.mg-switch {
  --mg-switch-height: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  color: var(--mg-color-text-secondary, #6f7686);
  font: inherit;
  cursor: pointer;
  background: none;
  border: 0;
}
.mg-switch__track {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--mg-switch-width, 40px);
  min-width: 40px;
  height: var(--mg-switch-height);
  padding: 2px;
  color: #fff;
  background: var(--mg-switch-inactive, #b5b8bf);
  border-radius: 999px;
  transition: background 0.2s;
}
.mg-switch__thumb {
  position: absolute;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--mg-switch-height) - 4px);
  height: calc(var(--mg-switch-height) - 4px);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 2px #0003;
  transition: transform 0.2s;
}
.mg-switch.is-checked .mg-switch__track {
  background: var(--mg-switch-active, var(--mg-color-primary, #0052d9));
}
.mg-switch.is-checked .mg-switch__thumb {
  transform: translateX(calc(var(--mg-switch-width, 40px) - var(--mg-switch-height)));
}
.mg-switch__prompt {
  padding: 0 5px;
  font-size: 10px;
}
.mg-switch__spinner {
  width: 9px;
  height: 9px;
  border: 1px solid var(--mg-color-primary, #0052d9);
  border-right-color: transparent;
  border-radius: 50%;
  animation: mg-switch-spin 0.7s linear infinite;
}
.mg-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.mg-switch--large {
  --mg-switch-height: 24px;
}
.mg-switch--small {
  --mg-switch-height: 16px;
  font-size: 12px;
}
@keyframes mg-switch-spin {
  to {
    transform: rotate(360deg);
  }
}
.mg-switch { border-radius: 999px; outline: none; }
.mg-switch:not(.is-disabled):hover .mg-switch__track { box-shadow: 0 0 0 2px var(--mg-color-primary-light-9, #f2f3ff); }
.mg-switch:focus-visible .mg-switch__track { box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-switch:not(.is-disabled):active .mg-switch__thumb { transform: scale(.9); }
.mg-switch.is-checked:not(.is-disabled):active .mg-switch__thumb { transform: translateX(calc(var(--mg-switch-width, 40px) - var(--mg-switch-height))) scale(.9); }
</style>
