<template><component :is="tag" v-bind="$attrs" class="mg-aside" :style="{ width }"><slot /></component></template>
<script setup lang="ts">
defineOptions({ name: 'MgAside', inheritAttrs: false })
withDefaults(defineProps<{ width?: string; tag?: string }>(), { width: '300px', tag: 'aside' })
</script>
<style scoped>.mg-aside { box-sizing: border-box; flex-shrink: 0; overflow: auto; }</style>
