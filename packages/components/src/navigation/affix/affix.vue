<template><div ref="rootRef" v-bind="$attrs" class="mg-affix"><div :class="['mg-affix__content', { 'is-fixed': fixed }]" :style="contentStyle"><slot /></div></div></template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
defineOptions({ name: 'MgAffix', inheritAttrs: false })
const props = withDefaults(defineProps<{ offset?: number; offsetTop?: number; offsetBottom?: number; position?: 'top' | 'bottom'; target?: string | HTMLElement; zIndex?: number }>(), { offset: 0, position: 'top', zIndex: 100 })
const emit = defineEmits<{ change: [fixed: boolean]; scroll: [payload: { scrollTop: number; fixed: boolean }] }>()
const rootRef = ref<HTMLElement>(); const fixed = ref(false); let scrollTarget: HTMLElement | Window | undefined
const effectivePosition = computed(() => props.offsetBottom != null ? 'bottom' : props.offsetTop != null ? 'top' : props.position)
const effectiveOffset = computed(() => props.offsetBottom ?? props.offsetTop ?? props.offset)
const contentStyle = computed<CSSProperties>(() => ({ position: 'sticky', zIndex: props.zIndex, [effectivePosition.value]: `${effectiveOffset.value}px` }))
function resolveTarget() { return typeof props.target === 'string' ? document.querySelector<HTMLElement>(props.target) || window : props.target || window }
function update() {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect(); const next = effectivePosition.value === 'top' ? rect.top <= effectiveOffset.value : window.innerHeight - rect.bottom <= effectiveOffset.value
  if (next !== fixed.value) { fixed.value = next; emit('change', next) }
  const scrollTop = scrollTarget instanceof HTMLElement ? scrollTarget.scrollTop : window.scrollY
  emit('scroll', { scrollTop, fixed: fixed.value })
}
onMounted(() => { scrollTarget = resolveTarget(); scrollTarget.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update() })
onBeforeUnmount(() => { scrollTarget?.removeEventListener('scroll', update); window.removeEventListener('resize', update) })
defineExpose({ update, fixed, rootRef })
</script>
<style scoped>.mg-affix { width: 100%; }.mg-affix__content { width: fit-content; }</style>
