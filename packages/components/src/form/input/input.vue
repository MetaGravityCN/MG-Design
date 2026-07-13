<template>
  <div :class="inputClasses">
    <div v-if="$slots.prepend" class="mg-input__prepend"><slot name="prepend" /></div>
    <div class="mg-input__wrapper">
      <span v-if="$slots.prefix || prefixIcon" class="mg-input__prefix">
        <slot name="prefix"><component :is="prefixIcon" /></slot>
      </span>
      <textarea
        v-if="type === 'textarea'"
        ref="textareaRef"
        v-bind="$attrs"
        class="mg-input__inner mg-textarea__inner"
        :value="displayValue"
        :rows="rows"
        :disabled="isDisabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="formItem?.validateState === 'error' || undefined"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <input
        v-else
        ref="inputRef"
        v-bind="$attrs"
        class="mg-input__inner"
        :type="nativeInputType"
        :value="displayValue"
        :disabled="isDisabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :name="name"
        :aria-invalid="formItem?.validateState === 'error' || undefined"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <span v-if="showSuffix" class="mg-input__suffix">
        <button v-if="showClear" type="button" class="mg-input__action" aria-label="清空" @mousedown.prevent @click="clear">×</button>
        <button v-if="showPassword && modelValue" type="button" class="mg-input__action" :aria-label="passwordVisible ? '隐藏密码' : '显示密码'" @mousedown.prevent @click="passwordVisible = !passwordVisible">{{ passwordVisible ? '◉' : '○' }}</button>
        <span v-if="showWordLimit && maxlength" class="mg-input__count">{{ textLength }} / {{ maxlength }}</span>
        <slot name="suffix"><component :is="suffixIcon" v-if="suffixIcon" /></slot>
      </span>
    </div>
    <div v-if="$slots.append" class="mg-input__append"><slot name="append" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, useSlots, type Component } from 'vue'
import { formContextKey, formItemContextKey } from '@mg-design/primitives'

defineOptions({ name: 'MgInput', inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  size?: 'large' | 'default' | 'small'
  placeholder?: string
  clearable?: boolean
  showPassword?: boolean
  disabled?: boolean
  readonly?: boolean
  rows?: number
  maxlength?: number
  minlength?: number
  showWordLimit?: boolean
  autocomplete?: string
  name?: string
  prefixIcon?: Component
  suffixIcon?: Component
  formatter?: (value: string) => string
  parser?: (value: string) => string
  validateEvent?: boolean
}>(), { modelValue: '', type: 'text', rows: 2, autocomplete: 'off', validateEvent: true })

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const slots = useSlots()
const inputRef = ref<HTMLInputElement>()
const textareaRef = ref<HTMLTextAreaElement>()
const focused = ref(false)
const passwordVisible = ref(false)
const isDisabled = computed(() => props.disabled || form?.disabled?.value)
const displayValue = computed(() => props.formatter ? props.formatter(String(props.modelValue ?? '')) : String(props.modelValue ?? ''))
const textLength = computed(() => String(props.modelValue ?? '').length)
const nativeInputType = computed(() => props.showPassword ? (passwordVisible.value ? 'text' : 'password') : props.type)
const showClear = computed(() => props.clearable && !isDisabled.value && !props.readonly && Boolean(props.modelValue) && focused.value)
const showSuffix = computed(() => showClear.value || props.showPassword || props.showWordLimit || props.suffixIcon)
const inputClasses = computed(() => ['mg-input', props.type === 'textarea' && 'mg-textarea', props.size && `mg-input--${props.size}`, {
  'is-disabled': isDisabled.value,
  'is-focus': focused.value,
  'has-prepend': Boolean(slots.prepend),
  'has-append': Boolean(slots.append),
}])

function parsed(target: EventTarget | null) {
  const value = (target as HTMLInputElement | HTMLTextAreaElement).value
  return props.parser ? props.parser(value) : value
}
function handleInput(event: Event) { const value = parsed(event.target); emit('update:modelValue', value); emit('input', value) }
function handleChange(event: Event) { const value = parsed(event.target); emit('change', value); if (props.validateEvent) void formItem?.validate('change') }
function handleFocus(event: FocusEvent) { focused.value = true; emit('focus', event) }
function handleBlur(event: FocusEvent) { focused.value = false; emit('blur', event); if (props.validateEvent) void formItem?.validate('blur') }
function clear() { emit('update:modelValue', ''); emit('change', ''); emit('clear'); if (props.validateEvent) void formItem?.validate('change') }
function focus() { (inputRef.value || textareaRef.value)?.focus() }
function blur() { (inputRef.value || textareaRef.value)?.blur() }
function select() { (inputRef.value || textareaRef.value)?.select() }
function clearInput() { clear() }
defineExpose({ input: inputRef, textarea: textareaRef, ref: computed(() => inputRef.value || textareaRef.value), focus, blur, select, clear: clearInput })
</script>

<style scoped>
.mg-input { box-sizing: border-box; display: inline-flex; width: 100%; color: var(--mg-color-text-primary, #202633); font-size: 14px; line-height: 1.5; vertical-align: middle; }
.mg-input__wrapper { box-sizing: border-box; display: inline-flex; flex: 1; align-items: center; min-width: 0; min-height: 32px; padding: 1px 11px; background: var(--mg-color-white, #fff); border: 1px solid var(--mg-color-border, #dcdde1); border-radius: var(--mg-border-radius-base, 3px); transition: border-color .2s, box-shadow .2s; }
.mg-input__wrapper:hover { border-color: var(--mg-color-border-dark, #b5b8bf); }
.mg-input.is-focus .mg-input__wrapper { border-color: var(--mg-color-primary, #0052d9); box-shadow: 0 0 0 1px var(--mg-color-primary, #0052d9) inset; }
.mg-input__inner { box-sizing: border-box; flex: 1; min-width: 0; height: 28px; padding: 0; color: inherit; font: inherit; line-height: 28px; background: transparent; border: 0; outline: none; }
.mg-input__inner::placeholder { color: var(--mg-color-text-placeholder, #a1a7b3); }
.mg-input__prefix, .mg-input__suffix { display: inline-flex; align-items: center; gap: 6px; color: var(--mg-color-text-secondary, #6f7686); }
.mg-input__prefix { margin-right: 7px; }.mg-input__suffix { margin-left: 7px; }
.mg-input__prepend, .mg-input__append { display: inline-flex; align-items: center; padding: 0 14px; color: var(--mg-color-text-regular, #424a57); background: var(--mg-color-fill-light, #f5f6f7); border: 1px solid var(--mg-color-border, #dcdde1); }
.mg-input__prepend { border-right: 0; border-radius: 3px 0 0 3px; }.mg-input__append { border-left: 0; border-radius: 0 3px 3px 0; }
.mg-input.has-prepend .mg-input__wrapper { border-radius: 0 3px 3px 0; }.mg-input.has-append .mg-input__wrapper { border-radius: 3px 0 0 3px; }
.mg-input__action { padding: 0; color: inherit; font: inherit; cursor: pointer; background: none; border: 0; }.mg-input__count { font-size: 12px; white-space: nowrap; }
.mg-input.is-disabled { cursor: not-allowed; opacity: .6; }.mg-input.is-disabled .mg-input__wrapper { background: var(--mg-color-fill-light, #f5f6f7); }
.mg-input--large .mg-input__wrapper { min-height: 40px; }.mg-input--small .mg-input__wrapper { min-height: 24px; padding-inline: 7px; }
.mg-textarea .mg-input__wrapper { align-items: stretch; padding: 5px 11px; }.mg-textarea__inner { min-height: 52px; resize: vertical; line-height: 1.5; }
</style>
