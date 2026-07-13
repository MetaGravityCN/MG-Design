<template>
  <FormCore v-bind="$attrs"><slot /></FormCore>
</template>

<script setup lang="ts">
import FormCore from './form/form.vue'

defineOptions({ name: 'MgForm' })
</script>
