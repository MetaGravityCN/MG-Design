<template><div ref="rootRef" v-bind="$attrs" class="mg-infinite-scroll" @scroll.passive="check"><slot /><div ref="sentinelRef" class="mg-infinite-scroll__sentinel" aria-hidden="true" /></div></template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
defineOptions({ name: 'MgInfiniteScroll', inheritAttrs: false })
const props = withDefaults(defineProps<{ disabled?: boolean; delay?: number; distance?: number; immediate?: boolean; load?: () => void }>(), { delay: 200, distance: 0, immediate: true })
const emit = defineEmits<{ load: [] }>()
const rootRef = ref<HTMLElement>(); const sentinelRef = ref<HTMLElement>(); let lastRun = 0; let observer: IntersectionObserver | undefined
function invoke() { if (props.disabled) return; const now = Date.now(); if (now - lastRun < props.delay) return; lastRun = now; props.load?.(); emit('load') }
function check() { const root = rootRef.value; if (root && root.scrollHeight - root.scrollTop - root.clientHeight <= props.distance) invoke() }
onMounted(() => { if (typeof IntersectionObserver !== 'undefined' && rootRef.value && sentinelRef.value) { observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) invoke() }, { root: rootRef.value, rootMargin: `0px 0px ${props.distance}px 0px` }); observer.observe(sentinelRef.value) } if (props.immediate) queueMicrotask(check) })
onBeforeUnmount(() => observer?.disconnect())
defineExpose({ check, rootRef })
</script>
<style scoped>.mg-infinite-scroll { overflow: auto; }.mg-infinite-scroll__sentinel { width: 100%; height: 1px; pointer-events: none; }</style>
