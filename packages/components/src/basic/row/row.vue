<template>
  <component :is="tag" v-bind="$attrs" class="mg-row" :class="rowClasses" :style="rowStyles">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { mgRowGutterKey } from './context'

export type MgRowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
export type MgRowAlign = 'top' | 'middle' | 'bottom' | 'stretch'

defineOptions({ name: 'MgRow', inheritAttrs: false })
const props = withDefaults(defineProps<{
  gutter?: number
  justify?: MgRowJustify
  align?: MgRowAlign
  tag?: string
}>(), { gutter: 0, justify: 'start', align: 'top', tag: 'div' })

const gutter = computed(() => Math.max(0, props.gutter))
provide(mgRowGutterKey, gutter)

const rowClasses = computed(() => [
  `is-justify-${props.justify}`,
  `is-align-${props.align}`,
])
const rowStyles = computed(() => gutter.value > 0 ? {
  marginLeft: `${-gutter.value / 2}px`,
  marginRight: `${-gutter.value / 2}px`,
} : undefined)
</script>

<style scoped>
.mg-row { box-sizing: border-box; display: flex; flex-wrap: wrap; position: relative; }
.is-justify-start { justify-content: flex-start; }
.is-justify-end { justify-content: flex-end; }
.is-justify-center { justify-content: center; }
.is-justify-space-around { justify-content: space-around; }
.is-justify-space-between { justify-content: space-between; }
.is-justify-space-evenly { justify-content: space-evenly; }
.is-align-top { align-items: flex-start; }
.is-align-middle { align-items: center; }
.is-align-bottom { align-items: flex-end; }
.is-align-stretch { align-items: stretch; }
</style>
