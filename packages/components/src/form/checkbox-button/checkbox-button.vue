<template>
  <label :class="classes"
    ><input
      class="mg-checkbox-button__input"
      type="checkbox"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
    /><span class="mg-checkbox-button__inner"
      ><slot>{{ label }}</slot></span
    ></label
  >
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { formContextKey } from '@metagravity_cn/primitives'
import { checkboxGroupKey, type SelectionValue } from '../selection-context'
defineOptions({ name: 'MgCheckboxButton' })
const props = withDefaults(
  defineProps<{
    modelValue?: SelectionValue
    label?: SelectionValue
    value?: SelectionValue
    trueValue?: SelectionValue
    falseValue?: SelectionValue
    disabled?: boolean
    size?: 'large' | 'default' | 'small'
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    value: undefined,
    trueValue: undefined,
    falseValue: undefined,
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: SelectionValue]
  change: [value: SelectionValue]
}>()
const group = inject(checkboxGroupKey, undefined)
const form = inject(formContextKey, undefined)
const optionValue = computed(() => props.value ?? props.label ?? true)
const trueValue = computed(() => props.trueValue ?? true)
const falseValue = computed(() => props.falseValue ?? false)
const isChecked = computed(() =>
  group
    ? group.modelValue.value.some((item) => Object.is(item, optionValue.value))
    : Object.is(props.modelValue, trueValue.value)
)
const isDisabled = computed(() =>
  Boolean(props.disabled || group?.disabled.value || form?.disabled?.value)
)
const classes = computed(() => [
  'mg-checkbox-button',
  `mg-checkbox-button--${props.size || group?.size.value || 'default'}`,
  { 'is-checked': isChecked.value, 'is-disabled': isDisabled.value },
])
function handleChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (group) group.toggle(optionValue.value, checked)
  else {
    const value = checked ? trueValue.value : falseValue.value
    emit('update:modelValue', value)
    emit('change', value)
  }
}
</script>
<style scoped>
.mg-checkbox-button {
  display: inline-flex;
  cursor: pointer;
}
.mg-checkbox-button__input {
  position: absolute;
  opacity: 0;
}
.mg-checkbox-button__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 15px;
  color: var(--mg-color-text-regular, #424a57);
  font-size: 14px;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  margin-left: -1px;
}
.mg-checkbox-button:first-child .mg-checkbox-button__inner {
  margin-left: 0;
  border-radius: 3px 0 0 3px;
}
.mg-checkbox-button:last-child .mg-checkbox-button__inner {
  border-radius: 0 3px 3px 0;
}
.mg-checkbox-button.is-checked .mg-checkbox-button__inner {
  position: relative;
  z-index: 1;
  color: #fff;
  background: var(--mg-color-primary, #0052d9);
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-checkbox-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.mg-checkbox-button--large .mg-checkbox-button__inner {
  height: 40px;
  padding-inline: 19px;
}
.mg-checkbox-button--small .mg-checkbox-button__inner {
  height: 24px;
  padding-inline: 11px;
  font-size: 12px;
}
.mg-checkbox-button:not(.is-disabled):hover .mg-checkbox-button__inner { color: var(--mg-color-primary, #0052d9); border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-checkbox-button__input:focus-visible + .mg-checkbox-button__inner { position: relative; z-index: 2; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-checkbox-button:not(.is-disabled):active .mg-checkbox-button__inner { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-checkbox-button.is-checked:not(.is-disabled):hover .mg-checkbox-button__inner { color: #fff; background: var(--mg-color-primary-hover, #618dff); }
.mg-checkbox-button.is-checked:not(.is-disabled):active .mg-checkbox-button__inner { color: #fff; background: var(--mg-color-primary-active, #003cab); }
</style>
