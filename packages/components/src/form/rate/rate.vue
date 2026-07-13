<template>
  <div v-bind="$attrs" :class="classes" role="radiogroup" :aria-label="ariaLabel">
    <button
      v-for="index in max"
      :key="index"
      type="button"
      class="mg-rate__item"
      role="radio"
      :aria-checked="modelValue === index"
      :disabled="disabled"
      :style="{ color: colorFor(index) }"
      @mousemove="preview = valueFromPointer(index, $event)"
      @mouseleave="preview = 0"
      @click="select(valueFromPointer(index, $event))"
      @keydown.left.prevent="select(Math.max(0, modelValue - step))"
      @keydown.right.prevent="select(Math.min(max, modelValue + step))"
    >
      <span class="mg-rate__star">★</span
      ><span v-if="allowHalf" class="mg-rate__half" :style="{ width: `${fillFor(index)}%` }"
        >★</span
      ></button
    ><span v-if="showText" class="mg-rate__text">{{ currentText }}</span
    ><span v-else-if="showScore" class="mg-rate__text">{{ scoreText }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
defineOptions({ name: 'MgRate', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
    disabled?: boolean
    allowHalf?: boolean
    lowThreshold?: number
    highThreshold?: number
    colors?: string[] | Record<number, string>
    voidColor?: string
    disabledVoidColor?: string
    showText?: boolean
    showScore?: boolean
    textColor?: string
    texts?: string[]
    scoreTemplate?: string
    clearable?: boolean
    ariaLabel?: string
    validateEvent?: boolean
  }>(),
  {
    modelValue: 0,
    max: 5,
    lowThreshold: 2,
    highThreshold: 4,
    colors: () => ['#f7ba2a', '#f7ba2a', '#f7ba2a'],
    voidColor: '#c6d1de',
    disabledVoidColor: '#eff2f7',
    texts: () => ['极差', '失望', '一般', '满意', '惊喜'],
    scoreTemplate: '{value}',
    ariaLabel: '评分',
    validateEvent: true,
  }
)
const emit = defineEmits<{ 'update:modelValue': [value: number]; change: [value: number] }>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const preview = ref(0)
const step = computed(() => (props.allowHalf ? 0.5 : 1))
const current = computed(() => preview.value || props.modelValue)
const disabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
const classes = computed(() => ['mg-rate', { 'is-disabled': disabled.value }])
const currentText = computed(() => props.texts[Math.max(0, Math.ceil(props.modelValue) - 1)] || '')
const scoreText = computed(() => props.scoreTemplate.replace('{value}', String(props.modelValue)))
function fillFor(index: number) {
  return current.value >= index ? 100 : current.value >= index - 0.5 ? 50 : 0
}
function colorFor(index: number) {
  if (fillFor(index) === 0) return disabled.value ? props.disabledVoidColor : props.voidColor
  if (!Array.isArray(props.colors)) {
    const key = Object.keys(props.colors)
      .map(Number)
      .sort((a, b) => a - b)
      .find((threshold) => current.value <= threshold)
    return props.colors[key ?? Math.max(...Object.keys(props.colors).map(Number))]
  }
  return current.value <= props.lowThreshold
    ? props.colors[0]
    : current.value <= props.highThreshold
      ? props.colors[1]
      : props.colors[2]
}
function valueFromPointer(index: number, event: MouseEvent) {
  if (!props.allowHalf) return index
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  return event.clientX - rect.left < rect.width / 2 ? index - 0.5 : index
}
function select(value: number) {
  if (disabled.value) return
  const next = props.clearable && value === props.modelValue ? 0 : value
  emit('update:modelValue', next)
  emit('change', next)
  if (props.validateEvent) void formItem?.validate('change')
}
</script>
<style scoped>
.mg-rate {
  display: inline-flex;
  align-items: center;
  height: 32px;
}
.mg-rate__item {
  position: relative;
  width: 24px;
  padding: 0 2px;
  overflow: hidden;
  color: var(--mg-rate-void, #c6d1de);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  background: none;
  border: 0;
}
.mg-rate__star {
  color: inherit;
}
.mg-rate__half {
  position: absolute;
  top: 0;
  left: 2px;
  overflow: hidden;
  color: inherit;
  white-space: nowrap;
}
.mg-rate:not(.is-disabled) .mg-rate__item:hover {
  transform: scale(1.08);
}
.mg-rate__text {
  margin-left: 8px;
  color: v-bind(textColor);
  font-size: 14px;
}
.mg-rate.is-disabled {
  opacity: 0.7;
}
.mg-rate.is-disabled .mg-rate__item {
  cursor: default;
}
.mg-rate__item:focus-visible { border-radius: 2px; outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-rate:not(.is-disabled) .mg-rate__item:active { transform: scale(.92); }
</style>
