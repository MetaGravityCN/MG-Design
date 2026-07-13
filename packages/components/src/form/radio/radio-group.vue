<template><component :is="tag" v-bind="$attrs" class="mg-radio-group" role="radiogroup" :aria-label="label"><slot /></component></template>
<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { formContextKey, formItemContextKey } from '@mg-design/primitives'
import { radioGroupKey, type SelectionValue } from '../selection-context'
defineOptions({ name: 'MgRadioGroup', inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: SelectionValue; size?: 'large' | 'default' | 'small'; disabled?: boolean; label?: string; name?: string; tag?: string; validateEvent?: boolean }>(), { size: 'default', tag: 'div', validateEvent: true })
const emit = defineEmits<{ 'update:modelValue': [value: SelectionValue]; change: [value: SelectionValue] }>()
const form = inject(formContextKey, undefined); const formItem = inject(formItemContextKey, undefined)
const disabled = computed(() => Boolean(props.disabled || form?.disabled?.value))
function select(value: SelectionValue) { if (Object.is(value, props.modelValue)) return; emit('update:modelValue', value); emit('change', value); if (props.validateEvent) void formItem?.validate('change') }
provide(radioGroupKey, { modelValue: computed(() => props.modelValue), disabled, size: computed(() => props.size), name: props.name, select })
</script>
<style scoped>.mg-radio-group { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 14px; }</style>
