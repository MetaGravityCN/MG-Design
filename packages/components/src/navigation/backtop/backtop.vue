<template>
  <Transition name="mg-backtop-fade"
    ><button
      v-if="visible"
      v-bind="$attrs"
      type="button"
      class="mg-backtop"
      :style="buttonStyle"
      aria-label="回到顶部"
      @click="backToTop"
    >
      <slot>↑</slot>
    </button></Transition
  >
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
defineOptions({ name: 'MgBacktop', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    visibilityHeight?: number
    target?: string | HTMLElement
    right?: number
    bottom?: number
    behavior?: ScrollBehavior
  }>(),
  { visibilityHeight: 200, right: 40, bottom: 40, behavior: 'smooth' }
)
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const visible = ref(false)
let scrollTarget: HTMLElement | Window | undefined
const buttonStyle = computed<CSSProperties>(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}))
function resolveTarget() {
  return typeof props.target === 'string'
    ? document.querySelector<HTMLElement>(props.target) || window
    : props.target || window
}
function update() {
  visible.value =
    (scrollTarget instanceof HTMLElement ? scrollTarget.scrollTop : window.scrollY) >=
    props.visibilityHeight
}
function backToTop(event: MouseEvent) {
  scrollTarget?.scrollTo({ top: 0, behavior: props.behavior })
  emit('click', event)
}
onMounted(() => {
  scrollTarget = resolveTarget()
  scrollTarget.addEventListener('scroll', update, { passive: true })
  update()
})
onBeforeUnmount(() => scrollTarget?.removeEventListener('scroll', update))
defineExpose({
  update,
  visible,
  scrollToTop: () => scrollTarget?.scrollTo({ top: 0, behavior: props.behavior }),
})
</script>
<style scoped>
.mg-backtop {
  position: fixed;
  z-index: 100;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--mg-color-primary, #0052d9);
  font-size: 22px;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--mg-color-border-light, #ebecef);
  border-radius: 50%;
  box-shadow: 0 4px 14px rgb(0 0 0 / 12%);
}
.mg-backtop:hover { color: var(--mg-color-primary-hover, #618dff); box-shadow: var(--mg-box-shadow-hover, 0 8px 24px rgb(0 0 0 / 12%)); transform: translateY(-2px); }
.mg-backtop:focus-visible { outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff), var(--mg-box-shadow-dark); }
.mg-backtop:active { color: var(--mg-color-primary-active, #003cab); transform: translateY(0); }
.mg-backtop-fade-enter-active,
.mg-backtop-fade-leave-active {
  transition: opacity 0.2s;
}
.mg-backtop-fade-enter-from,
.mg-backtop-fade-leave-to {
  opacity: 0;
}
</style>
