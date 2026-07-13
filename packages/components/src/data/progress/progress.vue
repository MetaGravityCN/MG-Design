<template>
  <div
    v-bind="$attrs"
    :class="['mg-progress', `is-${type}`, status && `is-${status}`, { 'is-without-text': !showText, 'is-text-inside': textInside }]"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="safePercentage"
  >
    <template v-if="type === 'line'">
      <div class="mg-progress__bar">
        <div class="mg-progress__track" :style="{ height: `${strokeWidth}px` }">
          <div
            :class="['mg-progress__fill', { 'is-indeterminate': indeterminate }]"
            :style="lineFillStyles"
          >
            <span v-if="showText && textInside" class="mg-progress__inside-text">{{ displayText }}</span>
          </div>
        </div>
      </div>
      <div v-if="showText && !textInside" class="mg-progress__text"><slot :percentage="safePercentage">{{ statusText || displayText }}</slot></div>
    </template>
    <template v-else>
      <div class="mg-progress__circle" :style="{ width: `${width}px`, height: `${width}px` }">
        <svg :viewBox="`0 0 ${width} ${width}`" aria-hidden="true">
          <circle
            class="mg-progress__circle-track"
            :cx="width / 2" :cy="width / 2" :r="radius" fill="none"
            :stroke-width="strokeWidth" :stroke-linecap="strokeLinecap" :stroke-dasharray="`${pathLength} ${circumference}`"
            :transform="`rotate(${type === 'dashboard' ? 135 : -90} ${width / 2} ${width / 2})`"
            :style="circlePathStyles"
          />
          <circle
            :class="['mg-progress__circle-fill', { 'is-indeterminate': indeterminate }]"
            :cx="width / 2" :cy="width / 2" :r="radius" fill="none"
            :stroke-width="strokeWidth" :stroke-linecap="strokeLinecap" :stroke-dasharray="`${pathLength} ${circumference}`"
            :transform="`rotate(${type === 'dashboard' ? 135 : -90} ${width / 2} ${width / 2})`"
            :style="circleFillStyles"
          />
        </svg>
        <div v-if="showText" class="mg-progress__circle-text"><slot :percentage="safePercentage">{{ statusText || displayText }}</slot></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type MgProgressType = 'line' | 'circle' | 'dashboard'
export type MgProgressStatus = 'success' | 'warning' | 'exception'
export interface MgProgressColorStop { color: string; percentage: number }
export type MgProgressColor = string | MgProgressColorStop[] | ((percentage: number) => string)
defineOptions({ name: 'MgProgress', inheritAttrs: false })
const props = withDefaults(defineProps<{
  percentage?: number
  type?: MgProgressType
  strokeWidth?: number
  textInside?: boolean
  status?: MgProgressStatus
  color?: MgProgressColor
  width?: number
  showText?: boolean
  strokeLinecap?: 'butt' | 'round' | 'square'
  format?: (percentage: number) => string
  indeterminate?: boolean
  duration?: number
}>(), {
  percentage: 0, type: 'line', strokeWidth: 6, textInside: false, width: 126,
  showText: true, strokeLinecap: 'round', indeterminate: false, duration: 0.6,
})
const safePercentage = computed(() => Math.min(100, Math.max(0, Number(props.percentage) || 0)))
const displayText = computed(() => props.format?.(safePercentage.value) ?? `${safePercentage.value}%`)
const statusText = computed(() => props.status ? ({ success: '✓', warning: '!', exception: '×' })[props.status] : '')
const progressColor = computed(() => {
  if (props.status) return ({ success: 'var(--mg-color-success, #2ba471)', warning: 'var(--mg-color-warning, #ed7b2f)', exception: 'var(--mg-color-danger, #d54941)' })[props.status]
  if (typeof props.color === 'function') return props.color(safePercentage.value)
  if (Array.isArray(props.color)) {
    return [...props.color].sort((a, b) => a.percentage - b.percentage).find((stop) => safePercentage.value <= stop.percentage)?.color
      ?? props.color.at(-1)?.color
  }
  return props.color ?? 'var(--mg-color-primary, #0052d9)'
})
const lineFillStyles = computed(() => ({
  width: `${safePercentage.value}%`, backgroundColor: progressColor.value,
  borderRadius: props.strokeLinecap === 'round' ? `${props.strokeWidth / 2}px` : '0',
  transitionDuration: `${props.duration}s`,
}))
const radius = computed(() => (props.width - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const pathRatio = computed(() => props.type === 'dashboard' ? 0.75 : 1)
const pathLength = computed(() => circumference.value * pathRatio.value)
const circlePathStyles = computed(() => ({ stroke: 'var(--mg-fill-color, #edf0f5)' }))
const circleFillStyles = computed(() => ({
  stroke: progressColor.value,
  strokeDashoffset: `${pathLength.value * (1 - safePercentage.value / 100)}px`,
  transition: `stroke-dashoffset ${props.duration}s ease, stroke ${props.duration}s ease`,
}))
</script>

<style scoped>
.mg-progress { display: flex; align-items: center; gap: 10px; width: 100%; color: var(--mg-color-text-regular, #4e5669); font-size: 14px; line-height: 1; }
.mg-progress__bar { flex: 1; min-width: 0; }
.mg-progress__track { position: relative; overflow: hidden; background: var(--mg-fill-color, #edf0f5); border-radius: 100px; }
.mg-progress__fill { position: relative; display: flex; align-items: center; justify-content: flex-end; height: 100%; min-width: 0; transition: width .6s ease, background-color .3s ease; }
.mg-progress__inside-text { padding: 0 6px; color: #fff; font-size: 11px; white-space: nowrap; }
.mg-progress__text { flex: 0 0 auto; min-width: 36px; }
.mg-progress__circle { position: relative; flex: 0 0 auto; }
.mg-progress__circle svg { display: block; width: 100%; height: 100%; }
.mg-progress__circle-track, .mg-progress__circle-fill { vector-effect: non-scaling-stroke; }
.mg-progress__circle-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.mg-progress__fill.is-indeterminate { width: 40% !important; animation: mg-progress-indeterminate 1.4s ease infinite; }
.mg-progress__circle-fill.is-indeterminate { animation: mg-progress-circle 1.4s ease infinite; }
@keyframes mg-progress-indeterminate { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
@keyframes mg-progress-circle { to { transform: rotate(270deg); } }
</style>
