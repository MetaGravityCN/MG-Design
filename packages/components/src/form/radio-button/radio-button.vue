<template>
  <label :class="classes"
    ><input
      class="mg-radio-button__input"
      type="radio"
      :name="name || group?.name"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="select"
    /><span class="mg-radio-button__inner"
      ><slot>{{ label }}</slot></span
    ></label
  >
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { formContextKey } from '@mg-design/primitives'
import { radioGroupKey, type SelectionValue } from '../selection-context'
defineOptions({ name: 'MgRadioButton' })
const props = withDefaults(
  defineProps<{
    modelValue?: SelectionValue
    label?: SelectionValue
    value?: SelectionValue
    disabled?: boolean
    size?: 'large' | 'default' | 'small'
    name?: string
  }>(),
  { modelValue: undefined, label: undefined, value: undefined }
)
const emit = defineEmits<{
  'update:modelValue': [value: SelectionValue]
  change: [value: SelectionValue]
}>()
const group = inject(radioGroupKey, undefined)
const form = inject(formContextKey, undefined)
const optionValue = computed(() => props.value ?? props.label ?? '')
const isChecked = computed(() =>
  Object.is(group?.modelValue.value ?? props.modelValue, optionValue.value)
)
const isDisabled = computed(() =>
  Boolean(props.disabled || group?.disabled.value || form?.disabled?.value)
)
const classes = computed(() => [
  'mg-radio-button',
  `mg-radio-button--${props.size || group?.size.value || 'default'}`,
  { 'is-checked': isChecked.value, 'is-disabled': isDisabled.value },
])
function select() {
  if (group) group.select(optionValue.value)
  else {
    emit('update:modelValue', optionValue.value)
    emit('change', optionValue.value)
  }
}
</script>
<style scoped>
.mg-radio-button {
  display: inline-flex;
  cursor: pointer;
}
.mg-radio-button__input {
  position: absolute;
  opacity: 0;
}
.mg-radio-button__inner {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 15px;
  color: var(--mg-color-text-regular, #424a57);
  font-size: 14px;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  margin-left: -1px;
}
.mg-radio-button:first-child .mg-radio-button__inner {
  margin-left: 0;
  border-radius: 3px 0 0 3px;
}
.mg-radio-button:last-child .mg-radio-button__inner {
  border-radius: 0 3px 3px 0;
}
.mg-radio-button.is-checked .mg-radio-button__inner {
  position: relative;
  z-index: 1;
  color: #fff;
  background: var(--mg-color-primary, #0052d9);
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-radio-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.mg-radio-button--large .mg-radio-button__inner {
  height: 40px;
  padding-inline: 19px;
}
.mg-radio-button--small .mg-radio-button__inner {
  height: 24px;
  padding-inline: 11px;
  font-size: 12px;
}
.mg-radio-button:not(.is-disabled):hover .mg-radio-button__inner { color: var(--mg-color-primary, #0052d9); border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-radio-button__input:focus-visible + .mg-radio-button__inner { position: relative; z-index: 2; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-radio-button:not(.is-disabled):active .mg-radio-button__inner { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-radio-button.is-checked:not(.is-disabled):hover .mg-radio-button__inner { color: #fff; background: var(--mg-color-primary-hover, #618dff); }
.mg-radio-button.is-checked:not(.is-disabled):active .mg-radio-button__inner { color: #fff; background: var(--mg-color-primary-active, #003cab); }
</style>
