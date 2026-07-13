<template>
  <div v-bind="$attrs" class="mg-scrollbar" :style="rootStyle">
    <div ref="wrapRef" :class="['mg-scrollbar__wrap', wrapClass]" :style="wrapStyle" @scroll="onScroll">
      <component :is="tag" ref="viewRef" :class="['mg-scrollbar__view', viewClass]" :style="viewStyle"><slot /></component>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
defineOptions({ name: 'MgScrollbar', inheritAttrs: false })
const props = withDefaults(defineProps<{ height?: string | number; maxHeight?: string | number; native?: boolean; wrapStyle?: CSSProperties | string; wrapClass?: string; viewStyle?: CSSProperties | string; viewClass?: string; noresize?: boolean; tag?: string; always?: boolean; minSize?: number }>(), { tag: 'div', minSize: 20 })
const emit = defineEmits<{ scroll: [payload: { scrollTop: number; scrollLeft: number }] }>()
const wrapRef = ref<HTMLElement>(); const viewRef = ref<HTMLElement>()
const size = (value?: string | number) => typeof value === 'number' ? `${value}px` : value
const rootStyle = computed<CSSProperties>(() => ({ height: size(props.height), maxHeight: size(props.maxHeight) }))
function onScroll() { if (wrapRef.value) emit('scroll', { scrollTop: wrapRef.value.scrollTop, scrollLeft: wrapRef.value.scrollLeft }) }
function scrollTo(arg1: number | ScrollToOptions, arg2?: number) { if (typeof arg1 === 'number') wrapRef.value?.scrollTo(arg1, arg2 || 0); else wrapRef.value?.scrollTo(arg1) }
function setScrollTop(value: number) { if (wrapRef.value) wrapRef.value.scrollTop = value }
function setScrollLeft(value: number) { if (wrapRef.value) wrapRef.value.scrollLeft = value }
function update() { onScroll() }
defineExpose({ wrapRef, viewRef, scrollTo, setScrollTop, setScrollLeft, update })
</script>
<style scoped>.mg-scrollbar { position: relative; overflow: hidden; }.mg-scrollbar__wrap { width: 100%; height: 100%; max-height: inherit; overflow: auto; scrollbar-color: var(--mg-color-border-dark, #c7c9cf) transparent; scrollbar-width: thin; }.mg-scrollbar__wrap::-webkit-scrollbar { width: 6px; height: 6px; }.mg-scrollbar__wrap::-webkit-scrollbar-thumb { background: var(--mg-color-border-dark, #c7c9cf); border-radius: 3px; }.mg-scrollbar__wrap::-webkit-scrollbar-track { background: transparent; }</style>
