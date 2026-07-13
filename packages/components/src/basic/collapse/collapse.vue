<template><div v-bind="$attrs" class="mg-collapse"><slot /></div></template>
<script setup lang="ts">
import { provide } from 'vue'
import { collapseContextKey, type CollapseName } from './context'
defineOptions({ name: 'MgCollapse', inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: CollapseName | CollapseName[]; accordion?: boolean }>(), { modelValue: () => [] })
const emit = defineEmits<{ 'update:modelValue': [value: CollapseName | CollapseName[]]; change: [value: CollapseName | CollapseName[]] }>()
const activeValues = () => Array.isArray(props.modelValue) ? props.modelValue : props.modelValue === '' || props.modelValue == null ? [] : [props.modelValue]
function isActive(name: CollapseName) { return activeValues().includes(name) }
function toggle(name: CollapseName) {
  let value: CollapseName | CollapseName[]
  if (props.accordion) value = isActive(name) ? '' : name
  else value = isActive(name) ? activeValues().filter((item) => item !== name) : [...activeValues(), name]
  emit('update:modelValue', value); emit('change', value)
}
provide(collapseContextKey, { isActive, toggle })
defineExpose({ activeNames: activeValues })
</script>
<style scoped>.mg-collapse { border-top: 1px solid var(--mg-color-border-light, #ebecef); border-bottom: 1px solid var(--mg-color-border-light, #ebecef); }</style>
