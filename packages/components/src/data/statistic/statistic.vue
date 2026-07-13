<template>
  <div v-bind="$attrs" class="mg-statistic">
    <div v-if="$slots.title || title" class="mg-statistic__head"><slot name="title">{{ title }}</slot></div>
    <div class="mg-statistic__content" :style="valueStyle">
      <span v-if="$slots.prefix || prefix" class="mg-statistic__prefix"><slot name="prefix">{{ prefix }}</slot></span>
      <span class="mg-statistic__number">{{ formattedValue }}</span>
      <span v-if="$slots.suffix || suffix" class="mg-statistic__suffix"><slot name="suffix">{{ suffix }}</slot></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'

defineOptions({ name: 'MgStatistic', inheritAttrs: false })
const props = withDefaults(defineProps<{
  value?: number
  title?: string
  precision?: number
  duration?: number
  prefix?: string
  suffix?: string
  groupSeparator?: string
  decimalSeparator?: string
  formatter?: (value: number) => string
  valueStyle?: CSSProperties
}>(), {
  value: 0, title: '', precision: 0, duration: 0, prefix: '', suffix: '',
  groupSeparator: ',', decimalSeparator: '.', valueStyle: () => ({}),
})
const displayedValue = ref(props.duration > 0 ? 0 : props.value)
let frame = 0
function animateTo(target: number) {
  if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame)
  if (props.duration <= 0 || typeof requestAnimationFrame === 'undefined') { displayedValue.value = target; return }
  const from = displayedValue.value; const started = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / props.duration)
    displayedValue.value = from + (target - from) * (1 - Math.pow(1 - progress, 3))
    if (progress < 1) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
}
watch(() => props.value, animateTo, { immediate: true })
const formattedValue = computed(() => {
  if (props.formatter) return props.formatter(displayedValue.value)
  const fixed = displayedValue.value.toFixed(Math.max(0, props.precision))
  const [integer, decimal] = fixed.split('.')
  const grouped = props.groupSeparator ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator) : integer
  return decimal == null ? grouped : `${grouped}${props.decimalSeparator}${decimal}`
})
onBeforeUnmount(() => { if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame) })
</script>

<style scoped>
.mg-statistic { display: inline-flex; flex-direction: column; min-width: 0; }
.mg-statistic__head { margin-bottom: 6px; color: var(--mg-color-text-secondary, #6f7686); font-size: 14px; line-height: 1.5; }
.mg-statistic__content { display: flex; align-items: baseline; gap: 4px; color: var(--mg-color-text-primary, #272b34); font-size: 28px; font-variant-numeric: tabular-nums; line-height: 1.2; }
.mg-statistic__prefix, .mg-statistic__suffix { font-size: .65em; }
</style>
