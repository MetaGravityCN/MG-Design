<template>
  <div ref="rootRef" v-bind="$attrs" :class="classes">
    <button
      ref="buttonRef"
      type="button"
      class="mg-color-picker__trigger"
      :disabled="isDisabled"
      :aria-expanded="open"
      aria-label="选择颜色"
      @click="open = !open"
    >
      <span
        class="mg-color-picker__swatch"
        :style="{ background: modelValue || 'transparent' }"
      /><span v-if="!modelValue" class="mg-color-picker__empty">×</span>
    </button>
    <div v-show="open" class="mg-color-picker__panel">
      <div class="mg-color-picker__main">
        <input
          class="mg-color-picker__native"
          type="color"
          :value="hexColor"
          @input="onColor"
        /><input
          v-if="showAlpha"
          class="mg-color-picker__alpha"
          type="range"
          min="0"
          max="100"
          :value="alpha"
          aria-label="透明度"
          @input="onAlpha"
        />
      </div>
      <div v-if="predefine?.length" class="mg-color-picker__predefine">
        <button
          v-for="color in predefine"
          :key="color"
          type="button"
          :style="{ background: color }"
          :aria-label="color"
          @click="select(color)"
        />
      </div>
      <div class="mg-color-picker__footer">
        <input
          class="mg-color-picker__text"
          :value="draft"
          @input="draft = ($event.target as HTMLInputElement).value"
          @keydown.enter="confirm"
        /><button type="button" @click="clear">清空</button
        ><button type="button" @click="confirm">确定</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
defineOptions({ name: 'MgColorPicker', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    size?: 'large' | 'default' | 'small'
    showAlpha?: boolean
    colorFormat?: 'hex' | 'rgb' | 'hsl' | 'hsv'
    predefine?: string[]
    validateEvent?: boolean
  }>(),
  { modelValue: '', colorFormat: 'hex', validateEvent: true }
)
const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'active-change': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const rootRef = ref<HTMLElement>()
const buttonRef = ref<HTMLButtonElement>()
const open = ref(false)
const draft = ref(props.modelValue)
const isDisabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
const classes = computed(() => [
  'mg-color-picker',
  props.size && `mg-color-picker--${props.size}`,
  { 'is-disabled': isDisabled.value, 'is-open': open.value },
])
const hexColor = computed(() => {
  const match = (draft.value || props.modelValue).match(/^#([0-9a-f]{6})/i)
  return match ? `#${match[1]}` : '#0052d9'
})
const alpha = computed(() => {
  const value = draft.value || props.modelValue
  if (/^#[0-9a-f]{8}$/i.test(value))
    return Math.round((parseInt(value.slice(7, 9), 16) / 255) * 100)
  const match = value.match(/rgba?\([^,]+,[^,]+,[^,]+,?\s*([\d.]+)?\)/)
  return match?.[1] ? Math.round(Number(match[1]) * 100) : 100
})
const hexAlpha = (hex: string, a: number) =>
  `${hex}${Math.round((a / 100) * 255)
    .toString(16)
    .padStart(2, '0')}`
function onColor(event: Event) {
  const color = (event.target as HTMLInputElement).value
  draft.value = props.showAlpha ? hexAlpha(color, alpha.value) : color
  emit('active-change', draft.value)
}
function onAlpha(event: Event) {
  draft.value = hexAlpha(hexColor.value, Number((event.target as HTMLInputElement).value))
  emit('active-change', draft.value)
}
function select(color: string) {
  draft.value = color
  emit('active-change', color)
}
function confirm() {
  emit('update:modelValue', draft.value)
  emit('change', draft.value)
  open.value = false
  if (props.validateEvent) void formItem?.validate('change')
}
function clear() {
  draft.value = ''
  confirm()
}
function outside(event: Event) {
  if (!rootRef.value?.contains(event.target as Node)) open.value = false
}
watch(
  () => props.modelValue,
  (v) => (draft.value = v)
)
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
defineExpose({
  color: computed(() => props.modelValue),
  show: () => (open.value = true),
  hide: () => (open.value = false),
  focus: () => buttonRef.value?.focus(),
  blur: () => buttonRef.value?.blur(),
})
</script>
<style scoped>
.mg-color-picker {
  position: relative;
  display: inline-flex;
}
.mg-color-picker__trigger {
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  padding: 4px;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-color-picker:not(.is-disabled) .mg-color-picker__trigger:hover { border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-color-picker__trigger:focus-visible { border-color: var(--mg-color-control-focus-border, #0052d9); outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-color-picker:not(.is-disabled) .mg-color-picker__trigger:active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-color-picker__swatch {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background-image:
    linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 8px 8px;
}
.mg-color-picker__empty {
  position: absolute;
  inset: 6px;
}
.mg-color-picker__panel {
  position: absolute;
  z-index: 2000;
  top: calc(100% + 6px);
  left: 0;
  width: 240px;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 4px;
  box-shadow: 0 6px 18px #0002;
}
.mg-color-picker__main {
  display: flex;
  gap: 10px;
  align-items: center;
}
.mg-color-picker__native {
  width: 64px;
  height: 40px;
  padding: 0;
  border: 0;
}
.mg-color-picker__alpha {
  flex: 1;
}
.mg-color-picker__predefine {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}
.mg-color-picker__predefine button {
  width: 20px;
  height: 20px;
  padding: 0;
  cursor: pointer;
  border: 1px solid #0002;
  border-radius: 3px;
}
.mg-color-picker__predefine button:hover { transform: scale(1.12); }
.mg-color-picker__predefine button:focus-visible, .mg-color-picker__footer button:focus-visible { outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-color-picker__footer {
  display: flex;
  gap: 6px;
  margin-top: 12px;
}
.mg-color-picker__text {
  flex: 1;
  min-width: 0;
  padding: 4px 6px;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-color-picker__footer button {
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 3px;
}
.mg-color-picker__footer button:hover { color: var(--mg-color-primary, #0052d9); border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-color-picker__footer button:active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-color-picker--large .mg-color-picker__trigger {
  width: 40px;
  height: 40px;
}
.mg-color-picker--small .mg-color-picker__trigger {
  width: 24px;
  height: 24px;
}
.mg-color-picker.is-disabled {
  opacity: 0.6;
}
</style>
