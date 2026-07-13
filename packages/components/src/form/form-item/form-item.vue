<template>
  <div :class="itemClasses" role="group" :aria-labelledby="labelId" :aria-describedby="errorMessage ? errorId : undefined">
    <label v-if="label || $slots.label" :id="labelId" class="mg-form-item__label" :style="labelStyle">
      <span v-if="showLeftAsterisk" class="mg-form-item__asterisk" aria-hidden="true">*</span>
      <slot name="label" :label="label"><span>{{ label }}</span></slot>
      <span v-if="showRightAsterisk" class="mg-form-item__asterisk" aria-hidden="true">*</span>
    </label>
    <div class="mg-form-item__content">
      <slot />
      <slot v-if="errorMessage && shouldShowMessage" name="error" :error="errorMessage">
        <div :id="errorId" class="mg-form-item__error" role="alert">{{ errorMessage }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, type CSSProperties } from 'vue'
import { formContextKey, formItemContextKey, getValueAtPath, setValueAtPath, useStableId, type FormValidateState, type FormValidateTrigger } from '@metagravity_cn/primitives'
import type { FormRule } from '../types'

defineOptions({ name: 'MgFormItem' })

const props = withDefaults(defineProps<{
  label?: string
  labelWidth?: string | number
  prop?: string | Array<string | number>
  required?: boolean
  rules?: FormRule | FormRule[]
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  size?: 'large' | 'default' | 'small'
}>(), { showMessage: undefined, inlineMessage: undefined })

const form = inject(formContextKey, undefined)
const validateState = ref<FormValidateState>('')
const validateMessage = ref('')
const initialValue = ref<unknown>()
const labelId = useStableId('mg-form-label')
const errorId = useStableId('mg-form-error')
const normalizedRules = computed<FormRule[]>(() => {
  const local = props.rules ? (Array.isArray(props.rules) ? props.rules : [props.rules]) : []
  const globalRules = props.prop && form?.rules?.value
    ? form.rules.value[Array.isArray(props.prop) ? props.prop.join('.') : props.prop]
    : undefined
  const global = globalRules ? (Array.isArray(globalRules) ? globalRules : [globalRules]) : []
  const rules = [...global, ...local]
  if (props.required && !rules.some((rule) => rule.required)) rules.push({ required: true })
  return rules
})
const isRequired = computed(() => props.required || normalizedRules.value.some((rule) => rule.required))
const showLeftAsterisk = computed(() => isRequired.value && !form?.hideRequiredAsterisk?.value && form?.requireAsteriskPosition?.value !== 'right')
const showRightAsterisk = computed(() => isRequired.value && !form?.hideRequiredAsterisk?.value && form?.requireAsteriskPosition?.value === 'right')
const shouldShowMessage = computed(() => props.showMessage ?? form?.showMessage?.value ?? true)
const errorMessage = computed(() => props.error || validateMessage.value)
const labelStyle = computed<CSSProperties | undefined>(() => {
  const width = props.labelWidth ?? form?.labelWidth?.value
  return width === undefined || form?.labelPosition?.value === 'top'
    ? undefined
    : { width: typeof width === 'number' ? `${width}px` : width }
})
const itemClasses = computed(() => ['mg-form-item', props.size && `mg-form-item--${props.size}`, {
  'is-required': isRequired.value,
  'is-error': Boolean(errorMessage.value),
  'is-success': validateState.value === 'success',
  'is-validating': validateState.value === 'validating',
  'is-inline-message': props.inlineMessage ?? form?.inlineMessage?.value,
  'mg-form-item--label-top': form?.labelPosition?.value === 'top',
}])

function currentValue() {
  return props.prop && form?.model ? getValueAtPath(form.model, props.prop) : undefined
}

function ruleApplies(rule: FormRule, trigger?: FormValidateTrigger) {
  if (!trigger || !rule.trigger) return true
  return (Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]).includes(trigger)
}

async function runRule(rule: FormRule, value: unknown): Promise<string> {
  const empty = value === '' || value === undefined || value === null || (Array.isArray(value) && value.length === 0)
  if (rule.required && empty) return rule.message || `${props.label || props.prop || '该字段'}不能为空`
  if (empty) return ''
  const length = typeof value === 'number' ? value : String(value).length
  if (rule.len !== undefined && length !== rule.len) return rule.message || `长度应为 ${rule.len}`
  if (rule.min !== undefined && length < rule.min) return rule.message || `不能小于 ${rule.min}`
  if (rule.max !== undefined && length > rule.max) return rule.message || `不能大于 ${rule.max}`
  if (rule.pattern && !rule.pattern.test(String(value))) return rule.message || '格式不正确'
  const validator = rule.validator
  if (!validator) return ''
  return new Promise((resolve) => {
    let settled = false
    const done = (error?: Error | string) => { if (!settled) { settled = true; resolve(error instanceof Error ? error.message : error || '') } }
    try {
      const result = validator(rule, value, done)
      if (result instanceof Promise) result.then(() => done()).catch((error) => done(error))
      else if (result === false) done(rule.message || '校验失败')
      else if (result instanceof Error || typeof result === 'string') done(result)
      else if (validator.length < 3) done()
    } catch (error) { done(error as Error) }
  })
}

async function validate(trigger?: FormValidateTrigger) {
  const rules = normalizedRules.value.filter((rule) => ruleApplies(rule, trigger))
  if (!rules.length) return true
  validateState.value = 'validating'
  for (const rule of rules) {
    const message = await runRule(rule, currentValue())
    if (message) {
      validateState.value = 'error'
      validateMessage.value = message
      form?.emitValidate?.(props.prop || '', false, message)
      return false
    }
  }
  validateState.value = 'success'
  validateMessage.value = ''
  form?.emitValidate?.(props.prop || '', true, '')
  return true
}

function clearValidate() { validateState.value = ''; validateMessage.value = '' }
function resetField() {
  if (props.prop && form?.model) setValueAtPath(form.model, props.prop, initialValue.value)
  clearValidate()
}
function focus() {
  void nextTick(() => document.getElementById(labelId)?.parentElement?.querySelector<HTMLElement>('input, textarea, select, button, [tabindex]')?.focus())
}

const context = { prop: props.prop || '', validate, resetField, clearValidate, focus, get validateState() { return validateState.value } }
provide(formItemContextKey, context)
onMounted(() => { initialValue.value = currentValue(); if (props.prop) form?.addField(context) })
onBeforeUnmount(() => { if (props.prop) form?.removeField(context) })

defineExpose({ validate, resetField, clearValidate, validateState, validateMessage })
</script>

<style scoped>
.mg-form-item { display: flex; align-items: flex-start; margin-bottom: 18px; }
.mg-form-item__label { box-sizing: border-box; display: inline-flex; flex: 0 0 auto; justify-content: flex-end; gap: 3px; min-height: 32px; padding: 0 12px 0 0; color: var(--mg-color-text-regular, #424a57); font-size: 14px; line-height: 32px; }
.mg-form-item__asterisk, .mg-form-item__error { color: var(--mg-color-danger, #d54941); }
.mg-form-item__content { position: relative; display: flex; flex: 1; flex-wrap: wrap; align-items: center; min-width: 0; min-height: 32px; }
.mg-form-item__error { position: absolute; top: 100%; left: 0; padding-top: 2px; font-size: 12px; line-height: 1.2; }
.mg-form-item--label-top { display: block; }
.mg-form-item--label-top .mg-form-item__label { display: flex; justify-content: flex-start; width: auto; padding: 0 0 8px; line-height: 1.4; }
.mg-form-item.is-inline-message .mg-form-item__error { position: static; margin-left: 8px; padding: 0; }
</style>
