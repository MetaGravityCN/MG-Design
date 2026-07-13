<template><nav v-bind="$attrs" class="mg-breadcrumb" :aria-label="ariaLabel"><ol><slot /></ol></nav></template>

<script setup lang="ts">
import { provide, type Component } from 'vue'
import { mgBreadcrumbKey } from './context'

defineOptions({ name: 'MgBreadcrumb', inheritAttrs: false })
const props = withDefaults(defineProps<{ separator?: string; separatorIcon?: string | Component; ariaLabel?: string }>(), {
  separator: '/', ariaLabel: '面包屑导航',
})
provide(mgBreadcrumbKey, { get separator() { return props.separator }, get separatorIcon() { return props.separatorIcon } })
</script>

<style scoped>
.mg-breadcrumb { color: var(--mg-color-text-regular, #4e5669); font-size: 14px; line-height: 1.5; }
.mg-breadcrumb ol { display: flex; flex-wrap: wrap; align-items: center; gap: 0; margin: 0; padding: 0; list-style: none; }
.mg-breadcrumb :deep(.mg-breadcrumb-item:last-child .mg-breadcrumb-item__separator) { display: none; }
.mg-breadcrumb :deep(.mg-breadcrumb-item:last-child .mg-breadcrumb-item__inner) { color: var(--mg-color-text-secondary, #6f7686); font-weight: 400; pointer-events: none; }
</style>
