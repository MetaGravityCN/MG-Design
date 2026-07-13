<template><div v-bind="$attrs" :class="['mg-skeleton-item', `is-${variant}`]" aria-hidden="true" /></template>

<script setup lang="ts">
export type MgSkeletonItemVariant = 'p' | 'text' | 'h1' | 'h3' | 'caption' | 'button' | 'image' | 'circle' | 'rect'
defineOptions({ name: 'MgSkeletonItem', inheritAttrs: false })
withDefaults(defineProps<{ variant?: MgSkeletonItemVariant }>(), { variant: 'text' })
</script>

<style scoped>
.mg-skeleton-item { display: block; width: 100%; height: 16px; background: var(--mg-fill-color, #edf0f5); border-radius: var(--mg-border-radius-small, 2px); }
.mg-skeleton-item.is-h1 { height: 24px; }
.mg-skeleton-item.is-h3 { height: 20px; }
.mg-skeleton-item.is-caption { width: 60%; height: 12px; }
.mg-skeleton-item.is-button { width: 64px; height: 32px; border-radius: var(--mg-border-radius-base, 4px); }
.mg-skeleton-item.is-image, .mg-skeleton-item.is-rect { height: 120px; }
.mg-skeleton-item.is-circle { width: 48px; height: 48px; border-radius: 50%; }
</style>
