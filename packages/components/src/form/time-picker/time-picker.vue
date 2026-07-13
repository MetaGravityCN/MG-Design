<template>
  <div v-bind="$attrs" :class="classes">
    <template v-if="isRange"
      ><input
        ref="startRef"
        class="mg-time-picker__input"
        type="time"
        :value="values[0]"
        :placeholder="startPlaceholder"
        :disabled="isDisabled"
        :step="stepSeconds"
        @input="updateRange(0, $event)"
        @change="commit" /><span class="mg-time-picker__separator">{{ rangeSeparator }}</span
      ><input
        class="mg-time-picker__input"
        type="time"
        :value="values[1]"
        :placeholder="endPlaceholder"
        :disabled="isDisabled"
        :step="stepSeconds"
        @input="updateRange(1, $event)"
        @change="commit" /></template
    ><input
      v-else
      ref="inputRef"
      class="mg-time-picker__input"
      type="time"
      :value="values[0]"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :step="stepSeconds"
      @input="updateSingle"
      @change="commit"
    /><button
      v-if="clearable && values.some(Boolean)"
      type="button"
      class="mg-time-picker__clear"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formContextKey, formItemContextKey } from '@mg-design/primitives'
type TimeValue = string | Date
defineOptions({ name: 'MgTimePicker', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: TimeValue | TimeValue[] | null
    isRange?: boolean
    placeholder?: string
    startPlaceholder?: string
    endPlaceholder?: string
    rangeSeparator?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    format?: string
    valueFormat?: string
    arrowControl?: boolean
    validateEvent?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '选择时间',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    rangeSeparator: '至',
    clearable: true,
    validateEvent: true,
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: TimeValue | TimeValue[] | null]
  change: [value: TimeValue | TimeValue[] | null]
  clear: []
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const inputRef = ref<HTMLInputElement>()
const startRef = ref<HTMLInputElement>()
const isDisabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
const pad = (v: number) => String(v).padStart(2, '0')
const toInput = (value?: TimeValue) =>
  value instanceof Date
    ? `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`
    : value || ''
const values = computed(() => {
  const value = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue || '']
  return [toInput(value[0]), toInput(value[1])]
})
const stepSeconds = computed(() =>
  props.format?.includes('ss') || props.valueFormat?.includes('ss') ? 1 : 60
)
const classes = computed(() => [
  'mg-time-picker',
  { 'is-range': props.isRange, 'is-disabled': isDisabled.value },
])
function convert(value: string): TimeValue {
  if (
    props.valueFormat ||
    typeof (Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue) !== 'object'
  )
    return value
  const date = new Date()
  const [h, m, s = 0] = value.split(':').map(Number)
  date.setHours(h, m, s, 0)
  return date
}
function updateSingle(event: Event) {
  emit('update:modelValue', convert((event.target as HTMLInputElement).value))
}
function updateRange(index: number, event: Event) {
  const next = [...values.value]
  next[index] = (event.target as HTMLInputElement).value
  emit('update:modelValue', next.map(convert))
}
function commit() {
  emit('change', props.modelValue)
  if (props.validateEvent) void formItem?.validate('change')
}
function clear() {
  const value = props.isRange ? [] : null
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
.mg-time-picker {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  width: 180px;
  min-height: 32px;
  padding: 1px 9px;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-time-picker:focus-within {
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-time-picker:not(.is-disabled):hover { border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-time-picker:focus-within { box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-time-picker__input {
  flex: 1;
  min-width: 0;
  height: 28px;
  font: inherit;
  border: 0;
  outline: 0;
}
.mg-time-picker__separator {
  padding: 0 7px;
}
.mg-time-picker__clear {
  cursor: pointer;
  background: none;
  border: 0;
}
.mg-time-picker__clear:hover { color: var(--mg-color-danger, #d54941); }
.mg-time-picker__clear:focus-visible { border-radius: 2px; outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-time-picker.is-range {
  width: 320px;
}
.mg-time-picker.is-disabled {
  opacity: 0.6;
}
</style>
