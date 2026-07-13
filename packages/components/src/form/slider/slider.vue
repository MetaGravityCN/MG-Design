<template>
  <div v-bind="$attrs" :class="classes" :style="rootStyle">
    <input
      v-if="showInput && !range"
      class="mg-slider__number"
      type="number"
      :value="firstValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="isDisabled"
      @change="onNumberInput"
    />
    <div class="mg-slider__rail">
      <div class="mg-slider__fill" :style="fillStyle" />
      <span
        v-for="stop in stops"
        :key="stop"
        class="mg-slider__stop"
        :style="positionStyle(stop)"
      />
      <template v-for="mark in normalizedMarks" :key="mark.value"
        ><span class="mg-slider__mark-dot" :style="positionStyle(mark.value)" /><span
          class="mg-slider__mark-label"
          :style="positionStyle(mark.value)"
          >{{ mark.label }}</span
        ></template
      >
      <input
        v-for="(_, index) in handles"
        :key="index"
        class="mg-slider__range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="handles[index]"
        :disabled="isDisabled"
        :aria-label="range ? `范围值 ${index + 1}` : '滑块值'"
        @input="onInput(index, $event)"
        @change="onChange(index, $event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
defineOptions({ name: 'MgSlider', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: number | number[]
    min?: number
    max?: number
    step?: number
    range?: boolean
    showStops?: boolean
    showInput?: boolean
    vertical?: boolean
    height?: string
    marks?: Record<number, string | { style?: CSSProperties; label: string }>
    disabled?: boolean
    validateEvent?: boolean
  }>(),
  { modelValue: 0, min: 0, max: 100, step: 1, validateEvent: true }
)
const emit = defineEmits<{
  'update:modelValue': [value: number | number[]]
  input: [value: number | number[]]
  change: [value: number | number[]]
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const isDisabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
const handles = computed(() =>
  props.range
    ? Array.isArray(props.modelValue)
      ? [props.modelValue[0] ?? props.min, props.modelValue[1] ?? props.max]
      : [props.min, props.max]
    : [Array.isArray(props.modelValue) ? (props.modelValue[0] ?? props.min) : props.modelValue]
)
const firstValue = computed(() => handles.value[0])
const percent = (value: number) => ((value - props.min) / Math.max(1, props.max - props.min)) * 100
const classes = computed(() => [
  'mg-slider',
  { 'is-vertical': props.vertical, 'is-disabled': isDisabled.value },
])
const rootStyle = computed<CSSProperties>(() =>
  props.vertical ? { height: props.height || '200px' } : {}
)
const fillStyle = computed<CSSProperties>(() => {
  const start = props.range ? percent(Math.min(...handles.value)) : 0
  const end = percent(Math.max(...handles.value))
  return props.vertical
    ? { bottom: `${start}%`, height: `${end - start}%` }
    : { left: `${start}%`, width: `${end - start}%` }
})
const stops = computed(() =>
  props.showStops
    ? Array.from(
        { length: Math.floor((props.max - props.min) / props.step) + 1 },
        (_, i) => props.min + i * props.step
      )
    : []
)
const normalizedMarks = computed(() =>
  Object.entries(props.marks || {}).map(([value, mark]) => ({
    value: Number(value),
    label: typeof mark === 'string' ? mark : mark.label,
  }))
)
function positionStyle(value: number): CSSProperties {
  return props.vertical ? { bottom: `${percent(value)}%` } : { left: `${percent(value)}%` }
}
function nextValue(index: number, event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (!props.range) return value
  const next = [...handles.value]
  next[index] = value
  return next.sort((a, b) => a - b)
}
function onInput(index: number, event: Event) {
  const value = nextValue(index, event)
  emit('update:modelValue', value)
  emit('input', value)
}
function onChange(index: number, event: Event) {
  const value = nextValue(index, event)
  emit('update:modelValue', value)
  emit('change', value)
  if (props.validateEvent) void formItem?.validate('change')
}
function onNumberInput(event: Event) {
  const value = Math.min(
    props.max,
    Math.max(props.min, Number((event.target as HTMLInputElement).value))
  )
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
<style scoped>
.mg-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 32px;
}
.mg-slider__number {
  width: 72px;
  height: 30px;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-slider__rail {
  position: relative;
  flex: 1;
  height: 6px;
  background: var(--mg-color-fill, #e7e9ed);
  border-radius: 3px;
}
.mg-slider__fill {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--mg-color-primary, #0052d9);
  border-radius: inherit;
}
.mg-slider__range {
  position: absolute;
  inset: -7px 0 auto;
  width: 100%;
  height: 20px;
  margin: 0;
  pointer-events: none;
  appearance: none;
  background: transparent;
}
.mg-slider__range::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  pointer-events: auto;
  cursor: pointer;
  appearance: none;
  background: #fff;
  border: 2px solid var(--mg-color-primary, #0052d9);
  border-radius: 50%;
  box-shadow: 0 1px 3px #0003;
}
.mg-slider__stop,
.mg-slider__mark-dot {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.mg-slider__mark-label {
  position: absolute;
  top: 14px;
  color: var(--mg-color-text-secondary, #6f7686);
  font-size: 12px;
  white-space: nowrap;
  transform: translateX(-50%);
}
.mg-slider.is-disabled {
  opacity: 0.55;
}
.mg-slider.is-vertical {
  display: inline-flex;
  width: 32px;
  min-height: 0;
}
.mg-slider.is-vertical .mg-slider__rail {
  width: 6px;
  height: 100%;
  flex: none;
}
.mg-slider.is-vertical .mg-slider__fill {
  top: auto;
  left: 0;
  width: 100%;
}
.mg-slider.is-vertical .mg-slider__range {
  inset: 0 auto 0 -7px;
  width: 20px;
  height: 100%;
  writing-mode: vertical-lr;
  direction: rtl;
}
.mg-slider.is-vertical .mg-slider__mark-label {
  top: auto;
  left: 14px;
  transform: translateY(50%);
}
.mg-slider__number:hover { border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-slider__number:focus-visible { border-color: var(--mg-color-control-focus-border, #0052d9); outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-slider:not(.is-disabled) .mg-slider__range:hover::-webkit-slider-thumb { transform: scale(1.08); }
.mg-slider__range:focus-visible { outline: none; }
.mg-slider__range:focus-visible::-webkit-slider-thumb { box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-slider:not(.is-disabled) .mg-slider__range:active::-webkit-slider-thumb { transform: scale(.92); }
.mg-slider.is-disabled .mg-slider__range::-webkit-slider-thumb { cursor: not-allowed; }
</style>
