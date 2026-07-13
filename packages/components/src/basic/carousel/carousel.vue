<template>
  <section
    v-bind="$attrs"
    :class="['mg-carousel', `is-${direction}`, `is-arrow-${arrow}`, { 'has-outside-indicators': indicatorPosition === 'outside' }]"
    @mouseenter="pauseOnHover && stopTimer()"
    @mouseleave="pauseOnHover && startTimer()"
  >
    <div class="mg-carousel__collector"><slot /></div>
    <div class="mg-carousel__viewport" :style="viewportStyle">
      <div v-if="activeItem" class="mg-carousel__slide" role="group" :aria-label="`${activeIndex + 1} / ${items.length}`">
        <SlotRenderer v-if="activeItem.slot" :render="activeItem.slot" />
      </div>
      <button v-if="arrow !== 'never' && items.length > 1" type="button" class="mg-carousel__arrow is-prev" aria-label="上一张" @click="prev">‹</button>
      <button v-if="arrow !== 'never' && items.length > 1" type="button" class="mg-carousel__arrow is-next" aria-label="下一张" @click="next">›</button>
    </div>
    <div v-if="indicatorPosition !== 'none' && items.length > 1" class="mg-carousel__indicators" role="tablist">
      <button v-for="(item, index) in items" :key="item.id" type="button" :class="{ 'is-active': index === activeIndex }" :aria-label="`第 ${index + 1} 张`" :aria-selected="index === activeIndex" @mouseenter="trigger === 'hover' && setActiveItem(index)" @click="trigger === 'click' && setActiveItem(index)"><span>{{ item.label }}</span></button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, provide, ref, watch, type CSSProperties, type Slot } from 'vue'
import { carouselContextKey, type CarouselItemConfig } from './context'
defineOptions({ name: 'MgCarousel', inheritAttrs: false })
const SlotRenderer = defineComponent((props: { render?: Slot }) => () => props.render?.(), { props: ['render'] })
const props = withDefaults(defineProps<{ initialIndex?: number; height?: string; trigger?: 'hover' | 'click'; autoplay?: boolean; interval?: number; indicatorPosition?: '' | 'none' | 'outside' | 'inside'; arrow?: 'always' | 'hover' | 'never'; loop?: boolean; direction?: 'horizontal' | 'vertical'; pauseOnHover?: boolean }>(), { initialIndex: 0, trigger: 'hover', autoplay: true, interval: 3000, indicatorPosition: 'inside', arrow: 'hover', loop: true, direction: 'horizontal', pauseOnHover: true })
const emit = defineEmits<{ change: [current: number, previous: number] }>()
const items = ref<CarouselItemConfig[]>([])
const activeIndex = ref(props.initialIndex)
let timer: ReturnType<typeof setInterval> | undefined
function register(item: CarouselItemConfig) { const index = items.value.findIndex((entry) => entry.id === item.id); index >= 0 ? items.value.splice(index, 1, item) : items.value.push(item); normalize() }
function unregister(id: string) { items.value = items.value.filter((item) => item.id !== id); normalize() }
function normalize() { activeIndex.value = Math.max(0, Math.min(activeIndex.value, items.value.length - 1)) }
provide(carouselContextKey, { register, unregister })
const activeItem = computed(() => items.value[activeIndex.value])
const viewportStyle = computed<CSSProperties>(() => ({ height: props.height }))
function setActiveItem(value: number | string) {
  let index = typeof value === 'number' ? value : items.value.findIndex((item) => String(item.name) === value)
  if (index < 0 || !items.value.length) return
  if (props.loop) index = (index + items.value.length) % items.value.length
  else index = Math.max(0, Math.min(index, items.value.length - 1))
  if (index === activeIndex.value) return
  const previous = activeIndex.value; activeIndex.value = index; emit('change', index, previous)
}
function prev() { setActiveItem(activeIndex.value - 1) }
function next() { setActiveItem(activeIndex.value + 1) }
function stopTimer() { if (timer) clearInterval(timer); timer = undefined }
function startTimer() { stopTimer(); if (props.autoplay && items.value.length > 1) timer = setInterval(next, Math.max(100, props.interval)) }
watch(() => [props.autoplay, props.interval, items.value.length], startTimer, { immediate: true })
onBeforeUnmount(stopTimer)
defineExpose({ setActiveItem, prev, next, activeIndex })
</script>

<style scoped>
.mg-carousel { position: relative; width: 100%; }
.mg-carousel__collector { display: none; }
.mg-carousel__viewport { position: relative; min-height: 120px; overflow: hidden; }
.mg-carousel__slide { width: 100%; height: 100%; }
.mg-carousel__slide > :deep(*) { width: 100%; height: 100%; }
.mg-carousel__arrow { position: absolute; top: 50%; z-index: 2; width: 36px; height: 36px; color: #fff; font-size: 24px; cursor: pointer; background: rgb(31 45 61 / 45%); border: 0; border-radius: 50%; transform: translateY(-50%); }
.mg-carousel__arrow.is-prev { left: 16px; }.mg-carousel__arrow.is-next { right: 16px; }
.mg-carousel.is-arrow-hover .mg-carousel__arrow { opacity: 0; transition: opacity .2s; }.mg-carousel.is-arrow-hover:hover .mg-carousel__arrow { opacity: 1; }
.mg-carousel__indicators { position: absolute; right: 0; bottom: 10px; left: 0; z-index: 3; display: flex; justify-content: center; gap: 6px; }
.mg-carousel__indicators button { width: 24px; height: 3px; padding: 0; cursor: pointer; background: rgb(255 255 255 / 55%); border: 0; }.mg-carousel__indicators button.is-active { background: #fff; }.mg-carousel__indicators span { font-size: 0; }
.mg-carousel.has-outside-indicators { padding-bottom: 24px; }.mg-carousel.has-outside-indicators .mg-carousel__indicators { bottom: 5px; }.mg-carousel.has-outside-indicators .mg-carousel__indicators button { background: var(--mg-color-border-dark, #c7c9cf); }.mg-carousel.has-outside-indicators .mg-carousel__indicators button.is-active { background: var(--mg-color-primary, #0052d9); }
.mg-carousel.is-vertical .mg-carousel__indicators { top: 0; right: 10px; bottom: 0; left: auto; flex-direction: column; }.mg-carousel.is-vertical .mg-carousel__indicators button { width: 3px; height: 24px; }
</style>
