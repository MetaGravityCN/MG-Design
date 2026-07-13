<template><component :is="tag" v-bind="$attrs" class="mg-header" :style="{ height }"><slot /></component></template>
<script setup lang="ts">
defineOptions({ name: 'MgHeader', inheritAttrs: false })
withDefaults(defineProps<{ height?: string; tag?: string }>(), { height: '60px', tag: 'header' })
</script>
<style scoped>.mg-header { box-sizing: border-box; flex-shrink: 0; padding: 0 20px; }</style>
