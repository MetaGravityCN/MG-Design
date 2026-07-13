<template>
  <span v-bind="$attrs" :class="tagClasses" :style="tagStyles" @click="emit('click', $event)">
    <span class="mg-tag__content"><slot /></span>
    <button v-if="closable" class="mg-tag__close" type="button" aria-label="关闭" @click.stop="emit('close', $event)">×</button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type MgTagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type MgTagSize = 'large' | 'default' | 'small'
export type MgTagEffect = 'light' | 'dark' | 'plain'
defineOptions({ name: 'MgTag', inheritAttrs: false })
const props = withDefaults(defineProps<{
  type?: MgTagType; size?: MgTagSize; closable?: boolean; disableTransitions?: boolean
  hit?: boolean; color?: string; effect?: MgTagEffect; round?: boolean
}>(), { type: 'primary', size: 'default', effect: 'light' })
const emit = defineEmits<{ click: [event: MouseEvent]; close: [event: MouseEvent] }>()
const tagClasses = computed(() => [
  'mg-tag', `mg-tag--${props.type}`, `mg-tag--${props.size}`, `is-${props.effect}`,
  { 'is-closable': props.closable, 'is-hit': props.hit, 'is-round': props.round, 'is-transition-disabled': props.disableTransitions },
])
const tagStyles = computed(() => props.color ? { '--mg-tag-custom-color': props.color } : undefined)
</script>

<style scoped>
.mg-tag { --mg-tag-color: var(--mg-tag-custom-color, var(--mg-color-primary, #0052d9)); box-sizing: border-box; display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 9px; color: var(--mg-tag-color); font-size: 12px; line-height: 1; white-space: nowrap; background: color-mix(in srgb, var(--mg-tag-color) 10%, white); border: 1px solid color-mix(in srgb, var(--mg-tag-color) 28%, white); border-radius: var(--mg-border-radius-base, 3px); transition: color .2s, background-color .2s, border-color .2s; }
.mg-tag--success { --mg-tag-color: var(--mg-color-success, #2ba471); }
.mg-tag--warning { --mg-tag-color: var(--mg-color-warning, #e37318); }
.mg-tag--danger { --mg-tag-color: var(--mg-color-danger, #d54941); }
.mg-tag--info { --mg-tag-color: var(--mg-color-info, #6f7686); }
.mg-tag--large { height: 32px; padding: 0 11px; font-size: 14px; }
.mg-tag--small { height: 20px; padding: 0 7px; }
.mg-tag.is-dark { color: #fff; background: var(--mg-tag-color); border-color: var(--mg-tag-color); }
.mg-tag.is-plain { background: transparent; border-color: var(--mg-tag-color); }
.mg-tag.is-hit { border-color: var(--mg-tag-color); }
.mg-tag.is-round { border-radius: 999px; }
.mg-tag.is-transition-disabled { transition: none; }
.mg-tag__close { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; padding: 0; color: inherit; font: inherit; font-size: 16px; line-height: 1; cursor: pointer; background: transparent; border: 0; border-radius: 50%; }
.mg-tag__close:hover { color: #fff; background: var(--mg-tag-color); }
</style>
