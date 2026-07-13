<template>
  <div v-bind="$attrs" :class="classes">
    <template v-if="isRange"
      ><input
        ref="startRef"
        class="mg-date-picker__input"
        :type="nativeType"
        :value="rangeValue[0]"
        :placeholder="startPlaceholder"
        :disabled="isDisabled"
        :min="minDate"
        :max="maxDate"
        @input="updateRange(0, $event)"
        @change="commit" /><span class="mg-date-picker__separator">{{ rangeSeparator }}</span
      ><input
        ref="endRef"
        class="mg-date-picker__input"
        :type="nativeType"
        :value="rangeValue[1]"
        :placeholder="endPlaceholder"
        :disabled="isDisabled"
        :min="minDate"
        :max="maxDate"
        @input="updateRange(1, $event)"
        @change="commit" /></template
    ><input
      v-else
      ref="inputRef"
      class="mg-date-picker__input"
      :type="nativeType"
      :value="singleValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :min="minDate"
      :max="maxDate"
      @input="updateSingle"
      @change="commit"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    /><button
      v-if="clearable && hasValue && !isDisabled"
      type="button"
      class="mg-date-picker__clear"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
type DateValue = string | number | Date
type PickerValue = DateValue | DateValue[] | undefined
defineOptions({ name: 'MgDatePicker', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: PickerValue
    type?:
      | 'date'
      | 'datetime'
      | 'datetime-local'
      | 'daterange'
      | 'datetimerange'
      | 'month'
      | 'monthrange'
      | 'year'
      | 'week'
    placeholder?: string
    startPlaceholder?: string
    endPlaceholder?: string
    rangeSeparator?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    size?: 'large' | 'default' | 'small'
    valueFormat?: string
    format?: string
    disabledDate?: (date: Date) => boolean
    validateEvent?: boolean
  }>(),
  {
    modelValue: undefined,
    type: 'date',
    placeholder: '选择日期',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    rangeSeparator: '至',
    clearable: true,
    validateEvent: true,
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: PickerValue]
  change: [value: PickerValue]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const inputRef = ref<HTMLInputElement>()
const startRef = ref<HTMLInputElement>()
const isDisabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
const isRange = computed(() => props.type.endsWith('range'))
const nativeType = computed(() =>
  props.type.includes('datetime')
    ? 'datetime-local'
    : props.type.includes('month')
      ? 'month'
      : props.type === 'year'
        ? 'number'
        : props.type === 'week'
          ? 'week'
          : 'date'
)
const pad = (value: number) => String(value).padStart(2, '0')
function toInput(value?: DateValue) {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value === 'string') return value
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  if (nativeType.value === 'month') return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
  if (nativeType.value === 'number') return String(date.getFullYear())
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return nativeType.value === 'datetime-local'
    ? `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    : day
}
function fromInput(value: string): DateValue {
  if (
    props.valueFormat ||
    typeof props.modelValue === 'string' ||
    (Array.isArray(props.modelValue) && typeof props.modelValue[0] === 'string')
  )
    return value
  const date = nativeType.value === 'number' ? new Date(Number(value), 0, 1) : new Date(value)
  return props.modelValue instanceof Date ||
    (Array.isArray(props.modelValue) && props.modelValue[0] instanceof Date)
    ? date
    : value
}
const singleValue = computed(() =>
  toInput(Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue)
)
const rangeValue = computed(() => {
  const values = Array.isArray(props.modelValue) ? props.modelValue : []
  return [toInput(values[0]), toInput(values[1])]
})
const hasValue = computed(() =>
  isRange.value ? rangeValue.value.some(Boolean) : Boolean(singleValue.value)
)
const classes = computed(() => [
  'mg-date-picker',
  { 'is-range': isRange.value, 'is-disabled': isDisabled.value },
  props.size && `mg-date-picker--${props.size}`,
])
const minDate = computed(() => '')
const maxDate = computed(() => '')
function updateSingle(event: Event) {
  emit('update:modelValue', fromInput((event.target as HTMLInputElement).value))
}
function updateRange(index: number, event: Event) {
  const next = [...rangeValue.value]
  next[index] = (event.target as HTMLInputElement).value
  emit('update:modelValue', next.map(fromInput))
}
function commit() {
  emit('change', props.modelValue)
  if (props.validateEvent) void formItem?.validate('change')
}
function clear() {
  const value = isRange.value ? [] : undefined
  emit('update:modelValue', value)
  emit('change', value)
  emit('clear')
}
function focus() {
  ;(inputRef.value || startRef.value)?.focus()
}
defineExpose({
  focus,
  handleOpen: focus,
  handleClose: () => (inputRef.value || startRef.value)?.blur(),
})
</script>
<style scoped>
.mg-date-picker {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  width: 220px;
  min-height: 32px;
  padding: 1px 9px;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-date-picker:focus-within {
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-date-picker:not(.is-disabled):hover { border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-date-picker:focus-within { box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-date-picker__input {
  flex: 1;
  min-width: 0;
  height: 28px;
  font: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  outline: 0;
}
.mg-date-picker__separator {
  padding: 0 7px;
  color: var(--mg-color-text-secondary, #6f7686);
}
.mg-date-picker__clear {
  cursor: pointer;
  background: none;
  border: 0;
}
.mg-date-picker__clear:hover { color: var(--mg-color-danger, #d54941); }
.mg-date-picker__clear:focus-visible { border-radius: 2px; outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-date-picker.is-range {
  width: 360px;
}
.mg-date-picker.is-disabled {
  opacity: 0.6;
}
.mg-date-picker--large {
  min-height: 40px;
}
.mg-date-picker--small {
  min-height: 24px;
  font-size: 12px;
}
</style>
