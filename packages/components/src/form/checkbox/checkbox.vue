<template>
  <label :class="classes">
    <input
      ref="inputRef"
      v-bind="$attrs"
      class="mg-checkbox__input"
      type="checkbox"
      :name="name"
      :value="label"
      :checked="isChecked"
      :disabled="isDisabled"
      :indeterminate.prop="indeterminate"
      @change="handleChange"
    />
    <span class="mg-checkbox__box" aria-hidden="true"
      ><span v-if="indeterminate">−</span><span v-else-if="isChecked">✓</span></span
    >
    <span v-if="$slots.default || label !== undefined" class="mg-checkbox__label"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
import { checkboxGroupKey, type SelectionValue } from '../selection-context'

defineOptions({ name: 'MgCheckbox', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: SelectionValue
    label?: SelectionValue
    value?: SelectionValue
    trueValue?: SelectionValue
    falseValue?: SelectionValue
    disabled?: boolean
    border?: boolean
    size?: 'large' | 'default' | 'small'
    indeterminate?: boolean
    checked?: boolean
    name?: string
    validateEvent?: boolean
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    value: undefined,
    trueValue: true,
    falseValue: false,
    checked: undefined,
    validateEvent: true,
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: SelectionValue]
  change: [value: SelectionValue]
}>()
const group = inject(checkboxGroupKey, undefined)
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const inputRef = ref<HTMLInputElement>()
const optionValue = computed(() => props.value ?? props.label ?? true)
const isChecked = computed(() =>
  group
    ? group.modelValue.value.some((item) => Object.is(item, optionValue.value))
    : props.checked || Object.is(props.modelValue, props.trueValue)
)
const isDisabled = computed(() =>
  Boolean(props.disabled || group?.disabled.value || form?.disabled?.value)
)
const size = computed(() => props.size || group?.size.value)
const classes = computed(() => [
  'mg-checkbox',
  size.value && `mg-checkbox--${size.value}`,
  {
    'is-checked': isChecked.value,
    'is-disabled': isDisabled.value,
    'is-bordered': props.border,
    'is-indeterminate': props.indeterminate,
  },
])
function handleChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (group) group.toggle(optionValue.value, checked)
  else {
    const value = checked ? props.trueValue : props.falseValue
    emit('update:modelValue', value)
    emit('change', value)
    if (props.validateEvent) void formItem?.validate('change')
  }
}
defineExpose({ ref: inputRef, focus: () => inputRef.value?.focus(), checked: isChecked })
</script>

<style scoped>
.mg-checkbox {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  color: var(--mg-color-text-regular, #424a57);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}
.mg-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.mg-checkbox__box {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  background: #fff;
  border: 1px solid var(--mg-color-border-dark, #b5b8bf);
  border-radius: 2px;
  transition: 0.2s;
}
.mg-checkbox:not(.is-disabled):hover .mg-checkbox__box,
.mg-checkbox__input:focus-visible + .mg-checkbox__box {
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-checkbox.is-checked .mg-checkbox__box,
.mg-checkbox.is-indeterminate .mg-checkbox__box {
  background: var(--mg-color-primary, #0052d9);
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.mg-checkbox:not(.is-disabled):active .mg-checkbox__box { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-checkbox.is-checked:not(.is-disabled):active .mg-checkbox__box, .mg-checkbox.is-indeterminate:not(.is-disabled):active .mg-checkbox__box { background: var(--mg-color-primary-active, #003cab); }
.mg-checkbox__input:focus-visible + .mg-checkbox__box { box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-checkbox.is-bordered {
  padding: 0 14px;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-checkbox.is-bordered.is-checked {
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-checkbox--large {
  min-height: 40px;
}
.mg-checkbox--small {
  min-height: 24px;
  font-size: 12px;
}
</style>
