<template>
  <div :class="numberClasses" role="group">
    <button v-if="controls" type="button" class="mg-input-number__button mg-input-number__decrease" :disabled="decreaseDisabled" aria-label="减少数值" @click="decrease">−</button>
    <input
      ref="inputRef"
      v-bind="$attrs"
      class="mg-input-number__input"
      type="text"
      inputmode="decimal"
      :value="displayValue"
      :disabled="isDisabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :name="name"
      :min="min"
      :max="max"
      :step="step"
      role="spinbutton"
      :aria-valuenow="modelValue ?? undefined"
      :aria-valuemin="finiteMin"
      :aria-valuemax="finiteMax"
      @input="handleInput"
      @change="commit"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
      @keydown.up.prevent="increase"
      @keydown.down.prevent="decrease"
    />
    <button v-if="controls" type="button" class="mg-input-number__button mg-input-number__increase" :disabled="increaseDisabled" aria-label="增加数值" @click="increase">+</button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'

defineOptions({ name: 'MgInputNumber', inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  stepStrictly?: boolean
  precision?: number
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  readonly?: boolean
  controls?: boolean
  controlsPosition?: '' | 'right'
  placeholder?: string
  name?: string
  valueOnClear?: number | null | 'min' | 'max'
  validateEvent?: boolean
}>(), { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY, step: 1, controls: true, controlsPosition: '', validateEvent: true })

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [current: number | null, previous: number | null]
  input: [value: number | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const inputRef = ref<HTMLInputElement>()
const rawValue = ref('')
const previousValue = ref<number | null>(props.modelValue ?? null)
const isDisabled = computed(() => props.disabled || form?.disabled?.value)
const finiteMin = computed(() => Number.isFinite(props.min) ? props.min : undefined)
const finiteMax = computed(() => Number.isFinite(props.max) ? props.max : undefined)
const displayValue = computed(() => rawValue.value || format(props.modelValue))
const decreaseDisabled = computed(() => isDisabled.value || props.readonly || (props.modelValue != null && props.modelValue <= props.min))
const increaseDisabled = computed(() => isDisabled.value || props.readonly || (props.modelValue != null && props.modelValue >= props.max))
const numberClasses = computed(() => ['mg-input-number', props.size && `mg-input-number--${props.size}`, props.controlsPosition === 'right' && 'is-controls-right', { 'is-disabled': isDisabled.value }])

watch(() => props.modelValue, () => { rawValue.value = '' })

function decimals(value: number) { return String(value).split('.')[1]?.length || 0 }
function effectivePrecision() { return props.precision ?? Math.max(decimals(props.step), decimals(props.modelValue || 0)) }
function format(value?: number | null) { return value == null || Number.isNaN(value) ? '' : props.precision === undefined ? String(value) : value.toFixed(props.precision) }
function normalize(value: number) {
  let next = value
  if (props.stepStrictly) next = Math.round(next / props.step) * props.step
  next = Math.min(props.max, Math.max(props.min, next))
  return Number(next.toFixed(effectivePrecision()))
}
function setValue(value: number | null, notifyChange = true) {
  const next = value == null ? null : normalize(value)
  emit('update:modelValue', next)
  emit('input', next)
  if (notifyChange && next !== previousValue.value) {
    emit('change', next, previousValue.value)
    previousValue.value = next
    if (props.validateEvent) void formItem?.validate('change')
  }
}
function handleInput(event: Event) {
  rawValue.value = (event.target as HTMLInputElement).value
  const numeric = Number(rawValue.value)
  if (rawValue.value !== '' && Number.isFinite(numeric)) setValue(numeric, false)
}
function clearedValue() {
  if (props.valueOnClear === 'min') return Number.isFinite(props.min) ? props.min : null
  if (props.valueOnClear === 'max') return Number.isFinite(props.max) ? props.max : null
  return typeof props.valueOnClear === 'number' ? props.valueOnClear : null
}
function commit(event?: Event) {
  const text = event ? (event.target as HTMLInputElement).value : rawValue.value
  const numeric = Number(text)
  setValue(text.trim() === '' ? clearedValue() : Number.isFinite(numeric) ? numeric : previousValue.value)
  rawValue.value = ''
}
function changeBy(direction: 1 | -1) {
  if (isDisabled.value || props.readonly) return
  const base = props.modelValue ?? (direction > 0 ? (Number.isFinite(props.min) ? props.min - props.step : 0) : (Number.isFinite(props.max) ? props.max + props.step : 0))
  setValue(base + direction * props.step)
}
function increase() { if (!increaseDisabled.value) changeBy(1) }
function decrease() { if (!decreaseDisabled.value) changeBy(-1) }
function handleBlur(event: FocusEvent) { commit(event); emit('blur', event); if (props.validateEvent) void formItem?.validate('blur') }
function focus() { inputRef.value?.focus() }
function blur() { inputRef.value?.blur() }
defineExpose({ focus, blur, ref: inputRef })
</script>

<style scoped>
.mg-input-number { position: relative; box-sizing: border-box; display: inline-flex; width: 150px; height: 32px; color: var(--mg-color-text-primary, #202633); font-size: 14px; }
.mg-input-number__input { box-sizing: border-box; width: 100%; padding: 0 39px; color: inherit; font: inherit; text-align: center; background: var(--mg-color-white, #fff); border: 1px solid var(--mg-color-border, #dcdde1); border-radius: var(--mg-border-radius-base, 3px); outline: none; transition: border-color .2s, box-shadow .2s; }
.mg-input-number__input:hover { border-color: var(--mg-color-border-dark, #b5b8bf); }.mg-input-number__input:focus { border-color: var(--mg-color-primary, #0052d9); box-shadow: 0 0 0 1px var(--mg-color-primary, #0052d9) inset; }
.mg-input-number__button { position: absolute; z-index: 1; top: 1px; bottom: 1px; width: 32px; padding: 0; color: var(--mg-color-text-regular, #424a57); font: inherit; cursor: pointer; background: var(--mg-color-fill-light, #f5f6f7); border: 0; }
.mg-input-number__button:hover:not(:disabled) { color: var(--mg-color-primary, #0052d9); }.mg-input-number__button:disabled { cursor: not-allowed; opacity: .45; }
.mg-input-number__decrease { left: 1px; border-right: 1px solid var(--mg-color-border, #dcdde1); border-radius: 2px 0 0 2px; }.mg-input-number__increase { right: 1px; border-left: 1px solid var(--mg-color-border, #dcdde1); border-radius: 0 2px 2px 0; }
.mg-input-number.is-controls-right .mg-input-number__input { padding: 0 38px 0 11px; text-align: left; }.mg-input-number.is-controls-right .mg-input-number__button { left: auto; right: 1px; width: 28px; height: 15px; border-left: 1px solid var(--mg-color-border, #dcdde1); }.mg-input-number.is-controls-right .mg-input-number__increase { top: 1px; bottom: auto; border-bottom: 1px solid var(--mg-color-border, #dcdde1); }.mg-input-number.is-controls-right .mg-input-number__decrease { top: auto; bottom: 1px; border-right: 0; }
.mg-input-number--large { height: 40px; width: 180px; }.mg-input-number--small { height: 24px; width: 120px; font-size: 12px; }.mg-input-number.is-disabled { opacity: .6; }
</style>
