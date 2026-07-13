<template>
  <div v-bind="$attrs" :class="['mg-badge', { 'has-content': Boolean($slots.default) }]">
    <slot />
    <sup v-if="!hidden" :class="badgeClasses" :style="resolvedBadgeStyle"><slot name="content">{{ content }}</slot></sup>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

export type MgBadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
defineOptions({ name: 'MgBadge', inheritAttrs: false })
const props = withDefaults(defineProps<{
  value?: string | number; max?: number; isDot?: boolean; hidden?: boolean; type?: MgBadgeType
  color?: string; badgeStyle?: Record<string, string | number>; offset?: [number, number]
}>(), { value: '', max: 99, type: 'danger' })
const slots = useSlots()
const content = computed(() => {
  if (props.isDot) return ''
  return typeof props.value === 'number' && props.value > props.max ? `${props.max}+` : props.value
})
const badgeClasses = computed(() => ['mg-badge__content', `mg-badge--${props.type}`, {
  'is-dot': props.isDot, 'is-fixed': Boolean(slots.default),
}])
const resolvedBadgeStyle = computed(() => ({
  ...(props.color ? { backgroundColor: props.color } : {}),
  ...(props.offset ? { marginRight: `${-props.offset[0]}px`, marginTop: `${props.offset[1]}px` } : {}),
  ...props.badgeStyle,
}))
</script>

<style scoped>
.mg-badge { position: relative; display: inline-flex; vertical-align: middle; }
.mg-badge__content { box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 6px; color: #fff; font-size: 11px; line-height: 1; white-space: nowrap; background: var(--mg-color-danger, #d54941); border: 1px solid #fff; border-radius: 9px; }
.mg-badge__content.is-fixed { position: absolute; z-index: 1; top: 0; right: 10px; transform: translate(100%, -50%); }
.mg-badge__content.is-dot { width: 8px; min-width: 8px; height: 8px; padding: 0; border-radius: 50%; }
.mg-badge--primary { background: var(--mg-color-primary, #0052d9); }
.mg-badge--success { background: var(--mg-color-success, #2ba471); }
.mg-badge--warning { background: var(--mg-color-warning, #e37318); }
.mg-badge--info { background: var(--mg-color-info, #6f7686); }
</style>
