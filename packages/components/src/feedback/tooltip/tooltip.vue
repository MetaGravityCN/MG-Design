<template>
  <span
    ref="referenceRef"
    v-bind="$attrs"
    class="mg-tooltip-trigger"
    :aria-describedby="actualVisible ? tooltipId : undefined"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  ><slot /></span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="mg-tooltip-fade" @after-enter="emit('after-show')" @after-leave="emit('after-hide')">
      <div
        v-if="actualVisible"
        :id="tooltipId"
        ref="floatingRef"
        :class="['mg-tooltip', `is-${effect}`]"
        :data-placement="resolvedPlacement"
        :style="floatingStyles"
        role="tooltip"
        @mouseenter="handleEnter"
        @mouseleave="handleLeave"
      >
        <slot name="content">{{ content }}</slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  autoUpdateFloating,
  computeFloatingPosition,
  overlayManager,
  useStableId,
  type FloatingPlacement,
  type OverlayHandle,
} from '@mg-design/primitives'

export type MgTooltipTrigger = 'hover' | 'click' | 'focus' | 'contextmenu'
defineOptions({ name: 'MgTooltip', inheritAttrs: false })
const props = withDefaults(defineProps<{
  visible?: boolean
  content?: string
  placement?: FloatingPlacement
  effect?: 'dark' | 'light'
  trigger?: MgTooltipTrigger
  disabled?: boolean
  showAfter?: number
  hideAfter?: number
  offset?: number
  teleported?: boolean
  appendTo?: string | HTMLElement
  zIndex?: number
}>(), {
  content: '', placement: 'bottom', effect: 'dark', trigger: 'hover', disabled: false,
  showAfter: 0, hideAfter: 200, offset: 8, teleported: true, appendTo: 'body',
})
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'visible-change': [value: boolean]
  'before-show': []
  'before-hide': []
  'after-show': []
  'after-hide': []
}>()

const referenceRef = ref<HTMLElement>()
const floatingRef = ref<HTMLElement>()
const internalVisible = ref(false)
const tooltipId = useStableId(undefined, 'mg-tooltip')
const position = ref({ x: 0, y: 0 })
const resolvedPlacement = ref<FloatingPlacement>(props.placement)
const resolvedZIndex = ref(props.zIndex ?? 2000)
const visibleControlled = Object.prototype.hasOwnProperty.call(getCurrentInstance()?.vnode.props ?? {}, 'visible')
const actualVisible = computed(() => !props.disabled && (visibleControlled ? props.visible === true : internalVisible.value))
const floatingStyles = computed(() => ({
  left: `${position.value.x}px`, top: `${position.value.y}px`, zIndex: resolvedZIndex.value,
}))
let timer: ReturnType<typeof setTimeout> | undefined
let stopAutoUpdate: (() => void) | undefined
let overlayHandle: OverlayHandle | undefined

function setVisible(value: boolean, delay = 0) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (props.disabled && value) return
    if (actualVisible.value === value) return
    if (value) emit('before-show')
    else emit('before-hide')
    if (!visibleControlled) internalVisible.value = value
    emit('update:visible', value)
    emit('visible-change', value)
  }, delay)
}
function show() { setVisible(true, props.showAfter) }
function hide() { setVisible(false, props.hideAfter) }
function handleEnter() { if (props.trigger === 'hover') show() }
function handleLeave() { if (props.trigger === 'hover') hide() }
function handleFocusIn() { if (props.trigger === 'focus') show() }
function handleFocusOut() { if (props.trigger === 'focus') hide() }
function handleClick() { if (props.trigger === 'click') setVisible(!actualVisible.value) }
function handleContextMenu(event: MouseEvent) {
  if (props.trigger !== 'contextmenu') return
  event.preventDefault()
  setVisible(!actualVisible.value)
}
function updatePosition() {
  if (!referenceRef.value || !floatingRef.value) return
  const next = computeFloatingPosition(referenceRef.value, floatingRef.value, { placement: props.placement, offset: props.offset })
  position.value = { x: next.x, y: next.y }
  resolvedPlacement.value = next.placement
}
function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (!referenceRef.value?.contains(target) && !floatingRef.value?.contains(target)) setVisible(false)
}
function onDocumentKeydown(event: KeyboardEvent) { if (event.key === 'Escape') setVisible(false) }

watch(actualVisible, async (visible) => {
  if (visible) {
    overlayHandle = overlayManager.open({ type: 'tooltip', close: () => setVisible(false) })
    resolvedZIndex.value = props.zIndex ?? overlayHandle.record.zIndex
    await nextTick()
    if (!actualVisible.value || !referenceRef.value || !floatingRef.value) return
    stopAutoUpdate = autoUpdateFloating(referenceRef.value, floatingRef.value, updatePosition)
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onDocumentKeydown)
  } else {
    stopAutoUpdate?.(); stopAutoUpdate = undefined
    overlayHandle?.release(); overlayHandle = undefined
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onDocumentKeydown)
  }
})
watch(() => props.disabled, (disabled) => {
  if (!disabled) return
  internalVisible.value = false
  emit('update:visible', false)
})
onBeforeUnmount(() => {
  clearTimeout(timer); stopAutoUpdate?.(); overlayHandle?.release()
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})
defineExpose({ show, hide, updatePosition, referenceRef, floatingRef })
</script>

<style scoped>
.mg-tooltip-trigger { display: inline-flex; }
.mg-tooltip { position: fixed; box-sizing: border-box; max-width: min(320px, calc(100vw - 16px)); padding: 6px 10px; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; border-radius: var(--mg-border-radius-base, 4px); box-shadow: var(--mg-box-shadow-light, 0 2px 8px rgb(0 0 0 / 12%)); }
.mg-tooltip.is-dark { color: #fff; background: var(--mg-color-text-primary, #272b34); }
.mg-tooltip.is-light { color: var(--mg-color-text-primary, #272b34); background: #fff; border: 1px solid var(--mg-border-color, #d8dbe2); }
.mg-tooltip-fade-enter-active, .mg-tooltip-fade-leave-active { transition: opacity .15s ease; }
.mg-tooltip-fade-enter-from, .mg-tooltip-fade-leave-to { opacity: 0; }
</style>
