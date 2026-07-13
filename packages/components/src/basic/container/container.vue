<template>
  <component :is="tag" v-bind="$attrs" :class="['mg-container', `is-${resolvedDirection}`]"><slot /></component>
</template>

<script setup lang="ts">
import { computed, type Component, type VNode } from 'vue'

defineOptions({ name: 'MgContainer', inheritAttrs: false })
const props = withDefaults(defineProps<{ direction?: 'horizontal' | 'vertical'; tag?: string }>(), { tag: 'section' })
const slots = defineSlots<{ default?: () => VNode[] }>()
const componentName = (node: VNode) => typeof node.type === 'object' ? (node.type as Component & { name?: string }).name : ''
const resolvedDirection = computed(() => {
  if (props.direction) return props.direction
  const children: VNode[] = slots.default?.() ?? []
  return children.some((node: VNode) => ['MgHeader', 'MgFooter'].includes(componentName(node) ?? '')) ? 'vertical' : 'horizontal'
})
</script>

<style scoped>
.mg-container { box-sizing: border-box; display: flex; flex: 1; flex-basis: auto; min-width: 0; }
.mg-container.is-horizontal { flex-direction: row; }
.mg-container.is-vertical { flex-direction: column; }
</style>
