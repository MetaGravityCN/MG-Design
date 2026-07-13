<template>
  <div v-bind="$attrs" :class="['mg-card', `is-${shadow}-shadow`]">
    <div v-if="header || $slots.header" class="mg-card__header"><slot name="header">{{ header }}</slot></div>
    <div :class="['mg-card__body', bodyClass]" :style="bodyStyle"><slot /></div>
    <div v-if="$slots.footer" class="mg-card__footer"><slot name="footer" /></div>
  </div>
</template>

<script setup lang="ts">
export type MgCardShadow = 'always' | 'hover' | 'never'
defineOptions({ name: 'MgCard', inheritAttrs: false })
withDefaults(defineProps<{
  header?: string
  shadow?: MgCardShadow
  bodyStyle?: Record<string, string | number>
  bodyClass?: string
}>(), { shadow: 'always', bodyClass: '' })
</script>

<style scoped>
.mg-card { box-sizing: border-box; overflow: hidden; color: var(--mg-color-text-primary, #272b34); background: var(--mg-color-white, #fff); border: 1px solid var(--mg-color-border-light, #e7e8eb); border-radius: var(--mg-border-radius-base, 3px); transition: box-shadow 0.2s; }
.mg-card.is-always-shadow { box-shadow: var(--mg-box-shadow-base, 0 1px 4px rgb(0 0 0 / 6%)); }
.mg-card.is-hover-shadow:hover { box-shadow: var(--mg-box-shadow-hover, 0 8px 24px rgb(0 0 0 / 6%)); }
.mg-card__header { box-sizing: border-box; padding: 18px 20px; border-bottom: 1px solid var(--mg-color-border-light, #e7e8eb); }
.mg-card__body { padding: 20px; }
.mg-card__footer { box-sizing: border-box; padding: 16px 20px; border-top: 1px solid var(--mg-color-border-light, #e7e8eb); }
</style>
