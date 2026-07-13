<template>
  <div v-bind="$attrs" :class="['mg-result', `is-${icon}`]">
    <div class="mg-result__icon" aria-hidden="true"><slot name="icon"><span>{{ iconText }}</span></slot></div>
    <div v-if="$slots.title || title" class="mg-result__title"><slot name="title">{{ title }}</slot></div>
    <div v-if="$slots['sub-title'] || subTitle" class="mg-result__subtitle"><slot name="sub-title">{{ subTitle }}</slot></div>
    <div v-if="$slots.extra" class="mg-result__extra"><slot name="extra" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type MgResultIcon = 'success' | 'warning' | 'info' | 'error'
defineOptions({ name: 'MgResult', inheritAttrs: false })
const props = withDefaults(defineProps<{ title?: string; subTitle?: string; icon?: MgResultIcon }>(), {
  title: '', subTitle: '', icon: 'info',
})
const iconText = computed(() => ({ success: '✓', warning: '!', info: 'i', error: '×' })[props.icon])
</script>

<style scoped>
.mg-result { display: flex; flex-direction: column; align-items: center; box-sizing: border-box; padding: 40px 30px; text-align: center; }
.mg-result__icon { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; color: var(--mg-color-primary, #0052d9); font-size: 38px; font-weight: 700; border: 4px solid currentcolor; border-radius: 50%; }
.mg-result.is-success .mg-result__icon { color: var(--mg-color-success, #2ba471); }
.mg-result.is-warning .mg-result__icon { color: var(--mg-color-warning, #ed7b2f); }
.mg-result.is-error .mg-result__icon { color: var(--mg-color-danger, #d54941); }
.mg-result__title { margin-top: 20px; color: var(--mg-color-text-primary, #272b34); font-size: 20px; line-height: 1.4; }
.mg-result__subtitle { margin-top: 8px; color: var(--mg-color-text-secondary, #6f7686); font-size: 14px; line-height: 1.5; }
.mg-result__extra { margin-top: 24px; }
</style>
