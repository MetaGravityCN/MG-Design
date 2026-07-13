<template><component :is="tag" v-bind="$attrs" class="mg-main"><slot /></component></template>
<script setup lang="ts">
defineOptions({ name: 'MgMain', inheritAttrs: false })
withDefaults(defineProps<{ tag?: string }>(), { tag: 'main' })
</script>
<style scoped>.mg-main { box-sizing: border-box; display: block; flex: 1; flex-basis: auto; min-width: 0; overflow: auto; padding: 20px; }</style>
