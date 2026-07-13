<template>
  <li v-bind="$attrs" :class="['mg-timeline-item', { 'is-center': center }]">
    <div class="mg-timeline-item__tail" aria-hidden="true" />
    <div
      :class="['mg-timeline-item__node', `is-${size}`, type && `is-${type}`, { 'is-hollow': hollow }]"
      :style="nodeStyles"
      aria-hidden="true"
    ><slot name="dot"><component :is="icon" v-if="icon && typeof icon !== 'string'" /><template v-else-if="icon">{{ icon }}</template></slot></div>
    <div class="mg-timeline-item__wrapper">
      <div v-if="!hideTimestamp && placement === 'top'" class="mg-timeline-item__timestamp is-top">{{ timestamp }}</div>
      <div class="mg-timeline-item__content"><slot /></div>
      <div v-if="!hideTimestamp && placement === 'bottom'" class="mg-timeline-item__timestamp is-bottom">{{ timestamp }}</div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

export type MgTimelineItemType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
defineOptions({ name: 'MgTimelineItem', inheritAttrs: false })
const props = withDefaults(defineProps<{
  timestamp?: string
  hideTimestamp?: boolean
  center?: boolean
  placement?: 'top' | 'bottom'
  type?: MgTimelineItemType
  color?: string
  size?: 'normal' | 'large'
  hollow?: boolean
  icon?: string | Component
}>(), { timestamp: '', hideTimestamp: false, center: false, placement: 'bottom', color: '', size: 'normal', hollow: false })
const nodeStyles = computed(() => props.color ? { color: props.color, backgroundColor: props.hollow ? '#fff' : props.color } : undefined)
</script>

<style scoped>
.mg-timeline-item { position: relative; box-sizing: border-box; padding-bottom: 24px; list-style: none; }
.mg-timeline-item:last-child { padding-bottom: 0; }
.mg-timeline-item__tail { position: absolute; top: 10px; bottom: -2px; left: 5px; border-left: 2px solid var(--mg-border-color-light, #e5e7ec); }
.mg-timeline-item:last-child .mg-timeline-item__tail { display: none; }
.mg-timeline-item__node { position: absolute; top: 5px; left: 1px; box-sizing: border-box; width: 10px; height: 10px; color: var(--mg-color-primary, #0052d9); background: currentcolor; border: 2px solid currentcolor; border-radius: 50%; }
.mg-timeline-item__node.is-large { top: 3px; left: -1px; width: 14px; height: 14px; }
.mg-timeline-item__node.is-hollow { background: #fff; }
.mg-timeline-item__node.is-success { color: var(--mg-color-success, #2ba471); }
.mg-timeline-item__node.is-warning { color: var(--mg-color-warning, #ed7b2f); }
.mg-timeline-item__node.is-danger { color: var(--mg-color-danger, #d54941); }
.mg-timeline-item__node.is-info { color: var(--mg-color-info, #6f7686); }
.mg-timeline-item__wrapper { position: relative; top: -3px; padding-left: 28px; }
.mg-timeline-item__content { color: var(--mg-color-text-primary, #272b34); line-height: 1.5; }
.mg-timeline-item__timestamp { color: var(--mg-color-text-secondary, #6f7686); font-size: 13px; line-height: 1.5; }
.mg-timeline-item__timestamp.is-top { margin-bottom: 6px; }
.mg-timeline-item__timestamp.is-bottom { margin-top: 6px; }
.mg-timeline-item.is-center .mg-timeline-item__node { top: 50%; transform: translateY(-50%); }
</style>
