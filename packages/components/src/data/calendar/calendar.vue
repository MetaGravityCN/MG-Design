<template>
  <section v-bind="$attrs" class="mg-calendar">
    <header class="mg-calendar__header">
      <slot name="header" :date="selectedDate">
        <strong>{{ title }}</strong>
        <div class="mg-calendar__actions">
          <button type="button" aria-label="上个月" @click="moveMonth(-1)">‹</button>
          <button type="button" @click="today">今天</button>
          <button type="button" aria-label="下个月" @click="moveMonth(1)">›</button>
        </div>
      </slot>
    </header>
    <div class="mg-calendar__weekdays" role="row">
      <span v-for="day in weekdays" :key="day" role="columnheader">{{ day }}</span>
    </div>
    <div class="mg-calendar__grid" role="grid">
      <button
        v-for="cell in cells"
        :key="cell.day"
        type="button"
        :class="['mg-calendar__cell', `is-${cell.type}`, { 'is-selected': cell.isSelected, 'is-today': cell.isToday }]"
        :aria-label="cell.day"
        :aria-selected="cell.isSelected"
        :disabled="!cell.inRange"
        @click="select(cell.date)"
      >
        <slot name="date-cell" :data="cell">
          <span>{{ cell.date.getDate() }}</span>
        </slot>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'MgCalendar', inheritAttrs: false })
const props = defineProps<{ modelValue?: Date | string | number; range?: [Date, Date] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Date]; change: [value: Date] }>()
const toDate = (value?: Date | string | number) => {
  const date = value instanceof Date ? new Date(value) : value != null ? new Date(value) : new Date()
  return Number.isNaN(date.getTime()) ? new Date() : date
}
const selectedDate = ref(toDate(props.modelValue))
const viewDate = ref(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1))
watch(() => props.modelValue, (value) => {
  selectedDate.value = toDate(value)
  viewDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1)
})
const weekdays = ['一', '二', '三', '四', '五', '六', '日']
const pad = (value: number) => String(value).padStart(2, '0')
const dayString = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const sameDay = (a: Date, b: Date) => dayString(a) === dayString(b)
const title = computed(() => `${viewDate.value.getFullYear()} 年 ${viewDate.value.getMonth() + 1} 月`)
const cells = computed(() => {
  const first = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(first); start.setDate(first.getDate() - mondayOffset)
  const today = new Date()
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start); date.setDate(start.getDate() + index)
    const monthDelta = date.getMonth() - viewDate.value.getMonth() + 12 * (date.getFullYear() - viewDate.value.getFullYear())
    return {
      date,
      day: dayString(date),
      type: monthDelta < 0 ? 'prev-month' : monthDelta > 0 ? 'next-month' : 'current-month',
      isSelected: sameDay(date, selectedDate.value),
      isToday: sameDay(date, today),
      inRange: !props.range || (date >= new Date(props.range[0].getFullYear(), props.range[0].getMonth(), props.range[0].getDate()) && date <= new Date(props.range[1].getFullYear(), props.range[1].getMonth(), props.range[1].getDate(), 23, 59, 59, 999)),
    }
  })
})
function select(date: Date) {
  selectedDate.value = new Date(date); viewDate.value = new Date(date.getFullYear(), date.getMonth(), 1)
  emit('update:modelValue', new Date(date)); emit('change', new Date(date))
}
function moveMonth(delta: number) { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + delta, 1) }
function today() { select(new Date()) }
defineExpose({ selectDate: (type: 'prev-month' | 'next-month' | 'today') => type === 'today' ? today() : moveMonth(type === 'prev-month' ? -1 : 1) })
</script>

<style scoped>
.mg-calendar { color: var(--mg-color-text-regular, #424a57); background: #fff; border: 1px solid var(--mg-color-border-light, #ebecef); }
.mg-calendar__header { display: flex; justify-content: space-between; align-items: center; min-height: 56px; padding: 0 16px; border-bottom: 1px solid var(--mg-color-border-light, #ebecef); }
.mg-calendar__actions { display: flex; gap: 6px; }
.mg-calendar__actions button { min-width: 32px; height: 30px; color: inherit; cursor: pointer; background: #fff; border: 1px solid var(--mg-color-border, #dcdde1); border-radius: 3px; }
.mg-calendar__weekdays, .mg-calendar__grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
.mg-calendar__weekdays span { padding: 10px; text-align: center; color: var(--mg-color-text-secondary, #6f7686); }
.mg-calendar__cell { min-height: 72px; padding: 8px; text-align: left; vertical-align: top; cursor: pointer; background: #fff; border: 0; border-top: 1px solid var(--mg-color-border-lighter, #f0f1f3); border-right: 1px solid var(--mg-color-border-lighter, #f0f1f3); }
.mg-calendar__cell:hover, .mg-calendar__cell.is-selected { background: var(--mg-color-primary-light-9, #f2f3ff); }
.mg-calendar__cell.is-prev-month, .mg-calendar__cell.is-next-month { color: var(--mg-color-text-placeholder, #a1a7b3); }
.mg-calendar__cell:disabled { cursor: not-allowed; opacity: .35; }
.mg-calendar__cell.is-today > span { color: var(--mg-color-primary, #0052d9); font-weight: 700; }
</style>
