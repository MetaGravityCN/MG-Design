<template><ul v-bind="$attrs" class="mg-timeline"><slot /></ul></template>

<script setup lang="ts">
defineOptions({ name: 'MgTimeline', inheritAttrs: false })
</script>

<style scoped>
.mg-timeline { box-sizing: border-box; margin: 0; padding: 0; list-style: none; }
</style>
