<template>
  <component :is="tag" v-bind="$attrs" class="mg-checkbox-group" role="group" :aria-label="label"><slot /></component>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { formContextKey, formItemContextKey } from '@metagravity_cn/primitives'
import { checkboxGroupKey, type SelectionValue } from '../selection-context'

defineOptions({ name: 'MgCheckboxGroup', inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: SelectionValue[]; size?: 'large' | 'default' | 'small'; disabled?: boolean; min?: number; max?: number; label?: string; tag?: string; validateEvent?: boolean }>(), { modelValue: () => [], size: 'default', tag: 'div', validateEvent: true })
const emit = defineEmits<{ 'update:modelValue': [value: SelectionValue[]]; change: [value: SelectionValue[]] }>()
const form = inject(formContextKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const disabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
function toggle(value: SelectionValue, checked: boolean) {
  const current = [...props.modelValue]
  const index = current.findIndex((item) => Object.is(item, value))
  if (checked && index < 0 && (props.max === undefined || current.length < props.max)) current.push(value)
  if (!checked && index >= 0 && (props.min === undefined || current.length > props.min)) current.splice(index, 1)
  if (current.length === props.modelValue.length && current.every((item, i) => Object.is(item, props.modelValue[i]))) return
  emit('update:modelValue', current); emit('change', current)
  if (props.validateEvent) void formItem?.validate('change')
}
provide(checkboxGroupKey, { modelValue: computed(() => props.modelValue), disabled, size: computed(() => props.size), min: props.min, max: props.max, toggle })
</script>

<style scoped>.mg-checkbox-group { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 10px; }</style>
