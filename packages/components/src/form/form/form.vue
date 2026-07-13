<template>
  <form
    ref="formRef"
    v-bind="$attrs"
    :class="['mg-form', `mg-form--label-${labelPosition}`, { 'mg-form--inline': inline }]"
    @submit="emit('submit', $event)"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import {
  createFormFieldRegistry,
  formContextKey,
  type FormItemProp,
  type FormItemContext,
} from '@mg-design/primitives'
import type { FormRules } from '../types'

defineOptions({ name: 'MgForm', inheritAttrs: false })

const props = withDefaults(defineProps<{
  model?: Record<string, unknown>
  rules?: FormRules
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  disabled?: boolean
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: 'left' | 'right'
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  scrollToError?: boolean
}>(), {
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  showMessage: true,
  validateOnRuleChange: true,
})

const emit = defineEmits<{
  validate: [prop: FormItemProp, valid: boolean, message: string]
  submit: [event: Event]
}>()

const formRef = ref<HTMLFormElement>()
const registry = createFormFieldRegistry()
const context = {
  model: props.model,
  rules: toRef(props, 'rules'),
  disabled: computed(() => props.disabled),
  labelPosition: computed(() => props.labelPosition),
  labelWidth: computed(() => props.labelWidth),
  hideRequiredAsterisk: computed(() => props.hideRequiredAsterisk),
  requireAsteriskPosition: computed(() => props.requireAsteriskPosition),
  showMessage: computed(() => props.showMessage),
  inlineMessage: computed(() => props.inlineMessage),
  statusIcon: computed(() => props.statusIcon),
  emitValidate: (prop: FormItemProp, valid: boolean, message: string) => emit('validate', prop, valid, message),
  ...registry,
}
provide(formContextKey, context)

async function validate(callback?: (valid: boolean, fields?: unknown) => void) {
  const valid = await registry.validateField()
  callback?.(valid, valid ? undefined : registry.fields)
  if (!valid && props.scrollToError) registry.fields.find((field) => field.validateState === 'error')?.focus?.()
  return valid
}

async function validateField(propsToValidate?: FormItemProp | FormItemProp[], callback?: (valid: boolean) => void) {
  const valid = await registry.validateField(propsToValidate)
  callback?.(valid)
  return valid
}

function resetFields(propsToReset?: FormItemProp | FormItemProp[]) {
  selectFields(propsToReset).forEach((field) => field.resetField())
}

function clearValidate(propsToClear?: FormItemProp | FormItemProp[]) {
  selectFields(propsToClear).forEach((field) => field.clearValidate())
}

function scrollToField(prop: FormItemProp) {
  registry.getField(prop)?.focus?.()
}

function selectFields(requested?: FormItemProp | FormItemProp[]) {
  if (requested === undefined) return registry.fields
  const list = Array.isArray(requested) && typeof requested[0] !== 'number' ? requested : [requested]
  return list.map((prop) => registry.getField(prop as FormItemProp)).filter((field): field is FormItemContext => Boolean(field))
}

defineExpose({ validate, validateField, resetFields, clearValidate, scrollToField, fields: registry.fields, getField: registry.getField, ref: formRef })
</script>

<style scoped>
.mg-form { box-sizing: border-box; }
.mg-form--inline { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0 18px; }
</style>
