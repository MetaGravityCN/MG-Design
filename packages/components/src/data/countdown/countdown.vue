<template>
  <div v-bind="$attrs" class="mg-countdown">
    <div v-if="title || $slots.title" class="mg-countdown__title"><slot name="title">{{ title }}</slot></div>
    <div class="mg-countdown__value"><slot :value="remaining" :formatted-value="formattedValue">{{ formattedValue }}</slot></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({ name: 'MgCountdown', inheritAttrs: false })
const props = withDefaults(defineProps<{ value: number | Date | string; format?: string; title?: string; precision?: 'start' | 'end'; prefix?: string; suffix?: string }>(), { format: 'HH:mm:ss', precision: 'end' })
const emit = defineEmits<{ change: [value: number]; finish: [] }>()
const remaining = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
let finished = false
const target = () => props.value instanceof Date ? props.value.getTime() : typeof props.value === 'number' ? props.value : new Date(props.value).getTime()
function update() {
  const value = Math.max(0, target() - Date.now())
  remaining.value = Number.isFinite(value) ? value : 0
  emit('change', remaining.value)
  if (remaining.value === 0 && !finished) { finished = true; stop(); emit('finish') }
}
function stop() { if (timer) clearInterval(timer); timer = undefined }
function start() { stop(); finished = false; update(); if (remaining.value > 0) timer = setInterval(update, 250) }
watch(() => props.value, start, { immediate: true })
onBeforeUnmount(stop)
const pad = (value: number, length = 2) => String(Math.floor(value)).padStart(length, '0')
const formattedValue = computed(() => {
  const total = remaining.value
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const minutes = Math.floor((total % 3600000) / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const milliseconds = total % 1000
  const value = props.format
    .replace(/DD/g, pad(days))
    .replace(/HH/g, pad(hours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds))
    .replace(/SSS/g, pad(milliseconds, 3))
  return `${props.prefix || ''}${value}${props.suffix || ''}`
})
defineExpose({ start, stop, remaining })
</script>

<style scoped>
.mg-countdown { display: inline-flex; flex-direction: column; gap: 6px; }
.mg-countdown__title { color: var(--mg-color-text-secondary, #6f7686); font-size: 14px; }
.mg-countdown__value { color: var(--mg-color-text-primary, #202633); font-size: 24px; font-variant-numeric: tabular-nums; font-weight: 600; }
</style>
