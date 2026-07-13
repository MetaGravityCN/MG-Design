<template><ul v-bind="$attrs" class="mg-dropdown-menu" role="menu"><slot /></ul></template>

<script setup lang="ts">
defineOptions({ name: 'MgDropdownMenu', inheritAttrs: false })
</script>

<style scoped>
.mg-dropdown-menu { box-sizing: border-box; min-width: 120px; margin: 0; padding: 6px 0; list-style: none; }
</style>
