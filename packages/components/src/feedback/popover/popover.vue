<template>
  <span
    ref="referenceRef"
    v-bind="$attrs"
    class="mg-popover-trigger"
    :aria-expanded="actualVisible"
    :aria-controls="actualVisible ? popoverId : undefined"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  ><slot name="reference" /></span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="mg-popover-fade" @after-enter="emit('after-enter')" @after-leave="emit('after-leave')">
      <div
        v-if="actualVisible"
        :id="popoverId"
        ref="floatingRef"
        class="mg-popover"
        :data-placement="resolvedPlacement"
        :style="floatingStyles"
        role="dialog"
        tabindex="-1"
        @mouseenter="handleEnter"
        @mouseleave="handleLeave"
      >
        <div v-if="$slots.title || title" class="mg-popover__title"><slot name="title">{{ title }}</slot></div>
        <div class="mg-popover__content"><slot>{{ content }}</slot></div>
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
} from '@metagravity_cn/primitives'

export type MgPopoverTrigger = 'hover' | 'click' | 'focus' | 'contextmenu'
defineOptions({ name: 'MgPopover', inheritAttrs: false })
const props = withDefaults(defineProps<{
  visible?: boolean
  title?: string
  content?: string
  width?: string | number
  placement?: FloatingPlacement
  trigger?: MgPopoverTrigger
  disabled?: boolean
  showAfter?: number
  hideAfter?: number
  offset?: number
  teleported?: boolean
  appendTo?: string | HTMLElement
  zIndex?: number
}>(), {
  title: '', content: '', width: 150, placement: 'bottom', trigger: 'click', disabled: false,
  showAfter: 0, hideAfter: 200, offset: 8, teleported: true, appendTo: 'body',
})
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'visible-change': [value: boolean]
  show: []
  hide: []
  'before-enter': []
  'before-leave': []
  'after-enter': []
  'after-leave': []
}>()
const referenceRef = ref<HTMLElement>()
const floatingRef = ref<HTMLElement>()
const internalVisible = ref(false)
const popoverId = useStableId(undefined, 'mg-popover')
const position = ref({ x: 0, y: 0 })
const resolvedPlacement = ref<FloatingPlacement>(props.placement)
const resolvedZIndex = ref(props.zIndex ?? 2000)
const visibleControlled = Object.prototype.hasOwnProperty.call(getCurrentInstance()?.vnode.props ?? {}, 'visible')
const actualVisible = computed(() => !props.disabled && (visibleControlled ? props.visible === true : internalVisible.value))
const cssWidth = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width)
const floatingStyles = computed(() => ({
  left: `${position.value.x}px`, top: `${position.value.y}px`, width: cssWidth.value, zIndex: resolvedZIndex.value,
}))
let timer: ReturnType<typeof setTimeout> | undefined
let stopAutoUpdate: (() => void) | undefined
let overlayHandle: OverlayHandle | undefined

function setVisible(value: boolean, delay = 0) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (props.disabled && value) return
    if (actualVisible.value === value) return
    if (value) emit('before-enter')
    else emit('before-leave')
    if (!visibleControlled) internalVisible.value = value
    emit('update:visible', value)
    emit('visible-change', value)
    if (value) emit('show')
    else emit('hide')
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
  event.preventDefault(); setVisible(!actualVisible.value)
}
function updatePosition() {
  if (!referenceRef.value || !floatingRef.value) return
  const next = computeFloatingPosition(referenceRef.value, floatingRef.value, { placement: props.placement, offset: props.offset })
  position.value = { x: next.x, y: next.y }; resolvedPlacement.value = next.placement
}
function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (!referenceRef.value?.contains(target) && !floatingRef.value?.contains(target)) setVisible(false)
}
function onDocumentKeydown(event: KeyboardEvent) { if (event.key === 'Escape') setVisible(false) }
watch(actualVisible, async (visible) => {
  if (visible) {
    overlayHandle = overlayManager.open({ type: 'popover', close: () => setVisible(false) })
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
watch(() => props.disabled, (disabled) => { if (disabled) internalVisible.value = false })
onBeforeUnmount(() => {
  clearTimeout(timer); stopAutoUpdate?.(); overlayHandle?.release()
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})
defineExpose({ show, hide, updatePosition, referenceRef, floatingRef })
</script>

<style scoped>
.mg-popover-trigger { display: inline-flex; }
.mg-popover { position: fixed; box-sizing: border-box; max-width: calc(100vw - 16px); padding: 14px 16px; color: var(--mg-color-text-primary, #272b34); font-size: 14px; line-height: 1.5; overflow-wrap: anywhere; background: #fff; border: 1px solid var(--mg-border-color-light, #e5e7ec); border-radius: var(--mg-border-radius-base, 4px); box-shadow: var(--mg-box-shadow-light, 0 2px 8px rgb(0 0 0 / 12%)); outline: none; }
.mg-popover__title { margin-bottom: 8px; font-size: 16px; font-weight: 600; }
.mg-popover__content { color: var(--mg-color-text-regular, #4e5669); }
.mg-popover-fade-enter-active, .mg-popover-fade-leave-active { transition: opacity .15s ease, transform .15s ease; }
.mg-popover-fade-enter-from, .mg-popover-fade-leave-to { opacity: 0; transform: scale(.98); }
</style>
