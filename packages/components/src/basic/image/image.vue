<template>
  <div ref="rootRef" v-bind="$attrs" class="mg-image">
    <img v-if="shouldLoad && !failed" class="mg-image__inner" :src="src" :alt="alt" :style="imageStyle" @load="onLoad" @error="onError" @click="openViewer">
    <div v-if="(!shouldLoad || loading) && !failed" class="mg-image__placeholder"><slot name="placeholder"><img v-if="placeholderSrc" :src="placeholderSrc" :alt="alt"></slot></div>
    <div v-if="failed" class="mg-image__error"><slot name="error">加载失败</slot></div>
    <Teleport to="body">
      <div v-if="viewerVisible" class="mg-image-viewer" :style="{ zIndex }" role="dialog" aria-modal="true" aria-label="图片预览" @click.self="hideOnClickModal && closeViewer()">
        <slot name="viewer" :url="currentPreview" :index="previewIndex" :close="closeViewer">
          <button type="button" class="mg-image-viewer__close" aria-label="关闭预览" @click="closeViewer">×</button>
          <button v-if="previewList.length > 1" type="button" class="mg-image-viewer__prev" aria-label="上一张" @click="switchPreview(-1)">‹</button>
          <img :src="currentPreview" :alt="alt" :style="viewerImageStyle">
          <button v-if="previewList.length > 1" type="button" class="mg-image-viewer__next" aria-label="下一张" @click="switchPreview(1)">›</button>
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
defineOptions({ name: 'MgImage', inheritAttrs: false })
const props = withDefaults(defineProps<{ src: string; fit?: CSSProperties['objectFit']; alt?: string; lazy?: boolean; scrollContainer?: string | HTMLElement; previewSrcList?: string[]; initialIndex?: number; infinite?: boolean; hideOnClickModal?: boolean; previewTeleported?: boolean; zIndex?: number; placeholderSrc?: string; closeOnPressEscape?: boolean }>(), { alt: '', previewSrcList: () => [], initialIndex: 0, infinite: true, hideOnClickModal: true, zIndex: 2000, closeOnPressEscape: true })
const emit = defineEmits<{ load: [event: Event]; error: [event: Event]; switch: [index: number]; close: []; show: [] }>()
const rootRef = ref<HTMLElement>(); const shouldLoad = ref(!props.lazy); const loading = ref(true); const failed = ref(false); const viewerVisible = ref(false); const previewIndex = ref(props.initialIndex)
let observer: IntersectionObserver | undefined
const imageStyle = computed<CSSProperties>(() => ({ objectFit: props.fit }))
const viewerImageStyle = computed<CSSProperties>(() => ({ objectFit: props.fit || 'contain' }))
const previewList = computed(() => props.previewSrcList.length ? props.previewSrcList : [props.src])
const currentPreview = computed(() => previewList.value[previewIndex.value] || props.src)
function setupLazy() {
  observer?.disconnect(); if (!props.lazy) { shouldLoad.value = true; return }
  if (typeof IntersectionObserver === 'undefined' || !rootRef.value) { shouldLoad.value = true; return }
  const root = typeof props.scrollContainer === 'string' ? document.querySelector(props.scrollContainer) : props.scrollContainer
  observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) { shouldLoad.value = true; observer?.disconnect() } }, { root: root || null })
  observer.observe(rootRef.value)
}
function onLoad(event: Event) { loading.value = false; failed.value = false; emit('load', event) }
function onError(event: Event) { loading.value = false; failed.value = true; emit('error', event) }
function openViewer() { if (!props.previewSrcList.length) return; const ownIndex = previewList.value.indexOf(props.src); previewIndex.value = ownIndex >= 0 ? ownIndex : props.initialIndex; viewerVisible.value = true; emit('show') }
function closeViewer() { if (!viewerVisible.value) return; viewerVisible.value = false; emit('close') }
function switchPreview(delta: number) { let next = previewIndex.value + delta; if (props.infinite) next = (next + previewList.value.length) % previewList.value.length; else next = Math.max(0, Math.min(next, previewList.value.length - 1)); previewIndex.value = next; emit('switch', next) }
function onKeydown(event: KeyboardEvent) { if (!viewerVisible.value) return; if (event.key === 'Escape' && props.closeOnPressEscape) closeViewer(); if (event.key === 'ArrowLeft') switchPreview(-1); if (event.key === 'ArrowRight') switchPreview(1) }
watch(() => props.src, () => { loading.value = true; failed.value = false })
onMounted(() => { setupLazy(); document.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => { observer?.disconnect(); document.removeEventListener('keydown', onKeydown) })
defineExpose({ showPreview: openViewer, closeViewer, rootRef })
</script>

<style scoped>
.mg-image { position: relative; display: inline-block; overflow: hidden; vertical-align: top; }.mg-image__inner { display: block; width: 100%; height: 100%; cursor: inherit; }.mg-image__placeholder, .mg-image__error { position: absolute; inset: 0; display: grid; place-items: center; color: var(--mg-color-text-placeholder, #a1a7b3); background: var(--mg-color-fill-light, #f5f6f7); }.mg-image__placeholder img { width: 100%; height: 100%; object-fit: cover; }
.mg-image-viewer { position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; background: rgb(0 0 0 / 78%); }.mg-image-viewer img { max-width: 90vw; max-height: 90vh; }.mg-image-viewer button { position: absolute; z-index: 1; color: #fff; font-size: 36px; cursor: pointer; background: rgb(0 0 0 / 35%); border: 0; border-radius: 50%; }.mg-image-viewer__close { top: 24px; right: 24px; width: 44px; height: 44px; }.mg-image-viewer__prev, .mg-image-viewer__next { top: 50%; width: 48px; height: 48px; transform: translateY(-50%); }.mg-image-viewer__prev { left: 28px; }.mg-image-viewer__next { right: 28px; }
</style>
