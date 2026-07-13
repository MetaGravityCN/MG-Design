<template>
  <label :class="classes"
    ><input
      ref="inputRef"
      v-bind="$attrs"
      class="mg-radio__input"
      type="radio"
      :name="name || group?.name"
      :value="optionValue"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="select"
    /><span class="mg-radio__circle" aria-hidden="true" /><span class="mg-radio__label"
      ><slot>{{ label }}</slot></span
    ></label
  >
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
import { radioGroupKey, type SelectionValue } from '../selection-context'
defineOptions({ name: 'MgRadio', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: SelectionValue
    label?: SelectionValue
    value?: SelectionValue
    disabled?: boolean
    border?: boolean
    size?: 'large' | 'default' | 'small'
    name?: string
    validateEvent?: boolean
  }>(),
  { modelValue: undefined, label: undefined, value: undefined }
)
const emit = defineEmits<{
  'update:modelValue': [value: SelectionValue]
  change: [value: SelectionValue]
}>()
const group = inject(radioGroupKey, undefined)
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const inputRef = ref<HTMLInputElement>()
const optionValue = computed(() => props.value ?? props.label ?? '')
const isChecked = computed(() =>
  Object.is(group?.modelValue.value ?? props.modelValue, optionValue.value)
)
const isDisabled = computed(() =>
  Boolean(props.disabled || group?.disabled.value || form?.disabled?.value)
)
const size = computed(() => props.size || group?.size.value)
const classes = computed(() => [
  'mg-radio',
  size.value && `mg-radio--${size.value}`,
  { 'is-checked': isChecked.value, 'is-disabled': isDisabled.value, 'is-bordered': props.border },
])
function select() {
  if (group) group.select(optionValue.value)
  else {
    emit('update:modelValue', optionValue.value)
    emit('change', optionValue.value)
    if (props.validateEvent !== false) void formItem?.validate('change')
  }
}
defineExpose({ ref: inputRef, focus: () => inputRef.value?.focus() })
</script>
<style scoped>
.mg-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  color: var(--mg-color-text-regular, #424a57);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}
.mg-radio__input {
  position: absolute;
  opacity: 0;
}
.mg-radio__circle {
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 1px solid var(--mg-color-border-dark, #b5b8bf);
  border-radius: 50%;
  transition: 0.2s;
}
.mg-radio:not(.is-disabled):hover .mg-radio__circle,
.mg-radio__input:focus-visible + .mg-radio__circle {
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-radio.is-checked .mg-radio__circle {
  border: 5px solid var(--mg-color-primary, #0052d9);
}
.mg-radio.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.mg-radio:not(.is-disabled):active .mg-radio__circle { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-radio__input:focus-visible + .mg-radio__circle { box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-radio.is-bordered {
  padding: 0 14px;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-radio.is-bordered.is-checked {
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-radio--large {
  min-height: 40px;
}
.mg-radio--small {
  min-height: 24px;
  font-size: 12px;
}
</style>
