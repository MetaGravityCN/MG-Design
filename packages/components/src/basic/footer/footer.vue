<template><component :is="tag" v-bind="$attrs" class="mg-footer" :style="{ height }"><slot /></component></template>
<script setup lang="ts">
defineOptions({ name: 'MgFooter', inheritAttrs: false })
withDefaults(defineProps<{ height?: string; tag?: string }>(), { height: '60px', tag: 'footer' })
</script>
<style scoped>.mg-footer { box-sizing: border-box; flex-shrink: 0; padding: 0 20px; }</style>
