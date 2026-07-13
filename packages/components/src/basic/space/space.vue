<template>
  <div v-bind="$attrs" :class="spaceClasses" :style="spaceStyles">
    <template v-for="(child, index) in children" :key="child.key ?? index">
      <span class="mg-space__item" :style="itemStyles"><SlotNode :node="child" /></span>
      <span v-if="hasSpacer && index < children.length - 1" class="mg-space__spacer" aria-hidden="true">
        <slot name="spacer">
          <component :is="spacer" v-if="typeof spacer !== 'string' && typeof spacer !== 'number'" />
          <template v-else>{{ spacer }}</template>
        </slot>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, type VNode } from 'vue'

export type MgSpaceSize = number | string | [number | string, number | string]

defineOptions({ name: 'MgSpace', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    alignment?: 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline'
    direction?: 'horizontal' | 'vertical'
    size?: MgSpaceSize
    wrap?: boolean
    fill?: boolean
    fillRatio?: number
    spacer?: string | number | object
  }>(),
  { alignment: 'center', direction: 'horizontal', size: 'small', fillRatio: 100 },
)
const slots = defineSlots<{
  default?: () => VNode[]
  spacer?: () => VNode[]
}>()
const SlotNode = (slotProps: { node: VNode }) => slotProps.node
const children = computed(() => slots.default?.() ?? [])
const hasSpacer = computed(() => props.spacer !== undefined || Boolean(slots.spacer))
const namedSizes = { small: 8, default: 12, large: 16 } as const

function normalizeSize(value: number | string) {
  if (typeof value === 'number') return `${value}px`
  if (value in namedSizes) return `${namedSizes[value as keyof typeof namedSizes]}px`
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value
}

const gaps = computed(() => {
  const raw = Array.isArray(props.size) ? props.size : [props.size, props.size]
  return raw.map(normalizeSize)
})
const spaceClasses = computed(() => [
  'mg-space',
  `mg-space--${props.direction}`,
  { 'is-wrap': props.wrap, 'is-fill': props.fill },
])
const spaceStyles = computed(() => ({
  alignItems: props.alignment,
  columnGap: hasSpacer.value ? undefined : gaps.value[0],
  rowGap: gaps.value[1],
}))
const itemStyles = computed(() =>
  props.fill ? { flex: `1 1 ${props.fillRatio}%`, minWidth: 0 } : undefined,
)
</script>

<style scoped>
.mg-space { display: inline-flex; max-width: 100%; }
.mg-space--vertical { flex-direction: column; }
.mg-space.is-wrap { flex-wrap: wrap; }
.mg-space.is-fill { display: flex; width: 100%; }
.mg-space__item { display: inline-flex; align-items: inherit; }
.mg-space__spacer { display: inline-flex; align-items: center; margin-inline: 8px; }
</style>
