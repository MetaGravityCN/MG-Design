<template>
  <span
    ref="referenceRef"
    v-bind="$attrs"
    :class="['mg-dropdown', type && `is-${type}`]"
    :aria-expanded="actualVisible"
    :aria-controls="actualVisible ? menuId : undefined"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @click="handleClick"
    @contextmenu="handleContextMenu"
    @keydown="handleTriggerKeydown"
  ><slot /></span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="mg-dropdown-fade">
      <div
        v-if="actualVisible"
        :id="menuId"
        ref="floatingRef"
        class="mg-dropdown__popper"
        :data-placement="resolvedPlacement"
        :style="floatingStyles"
        @mouseenter="handleEnter"
        @mouseleave="handleLeave"
        @keydown="handleMenuKeydown"
      ><slot name="dropdown" /></div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'
import {
  autoUpdateFloating,
  computeFloatingPosition,
  overlayManager,
  useStableId,
  type FloatingPlacement,
  type OverlayHandle,
} from '@mg-design/primitives'
import { mgDropdownKey } from './context'

export type MgDropdownTrigger = 'hover' | 'click' | 'focus' | 'contextmenu'
defineOptions({ name: 'MgDropdown', inheritAttrs: false })
const props = withDefaults(defineProps<{
  visible?: boolean
  type?: string
  trigger?: MgDropdownTrigger
  placement?: FloatingPlacement
  hideOnClick?: boolean
  disabled?: boolean
  showTimeout?: number
  hideTimeout?: number
  offset?: number
  maxHeight?: string | number
  teleported?: boolean
  appendTo?: string | HTMLElement
  zIndex?: number
}>(), {
  type: '', trigger: 'hover', placement: 'bottom', hideOnClick: true, disabled: false,
  showTimeout: 150, hideTimeout: 150, offset: 8, maxHeight: '', teleported: true, appendTo: 'body',
})
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'visible-change': [value: boolean]
  command: [command: unknown, event: MouseEvent]
  click: [event: MouseEvent]
}>()
const referenceRef = ref<HTMLElement>()
const floatingRef = ref<HTMLElement>()
const internalVisible = ref(false)
const menuId = useStableId(undefined, 'mg-dropdown-menu')
const position = ref({ x: 0, y: 0 })
const resolvedPlacement = ref<FloatingPlacement>(props.placement)
const resolvedZIndex = ref(props.zIndex ?? 2000)
const visibleControlled = Object.prototype.hasOwnProperty.call(getCurrentInstance()?.vnode.props ?? {}, 'visible')
const actualVisible = computed(() => !props.disabled && (visibleControlled ? props.visible === true : internalVisible.value))
const cssMaxHeight = computed(() => typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight || undefined)
const floatingStyles = computed(() => ({
  left: `${position.value.x}px`, top: `${position.value.y}px`, maxHeight: cssMaxHeight.value, zIndex: resolvedZIndex.value,
}))
let timer: ReturnType<typeof setTimeout> | undefined
let stopAutoUpdate: (() => void) | undefined
let overlayHandle: OverlayHandle | undefined

function setVisible(value: boolean, delay = 0) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (props.disabled && value) return
    if (actualVisible.value === value) return
    if (!visibleControlled) internalVisible.value = value
    emit('update:visible', value); emit('visible-change', value)
  }, delay)
}
function show() { setVisible(true, props.showTimeout) }
function hide() { setVisible(false, props.hideTimeout) }
function close() { setVisible(false) }
function handleEnter() { if (props.trigger === 'hover') show() }
function handleLeave() { if (props.trigger === 'hover') hide() }
function handleFocusIn() { if (props.trigger === 'focus') show() }
function handleFocusOut(event: FocusEvent) {
  if (props.trigger !== 'focus') return
  const next = event.relatedTarget as Node | null
  if (!referenceRef.value?.contains(next) && !floatingRef.value?.contains(next)) hide()
}
function handleClick(event: MouseEvent) {
  emit('click', event)
  if (props.trigger === 'click') setVisible(!actualVisible.value)
}
function handleContextMenu(event: MouseEvent) {
  if (props.trigger !== 'contextmenu') return
  event.preventDefault(); setVisible(!actualVisible.value)
}
function getMenuItems() {
  return Array.from(floatingRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])
}
async function focusItem(position: 'first' | 'last') {
  await nextTick(); const items = getMenuItems(); (position === 'first' ? items[0] : items.at(-1))?.focus()
}
function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault(); setVisible(true); void focusItem('first')
  } else if (event.key === 'ArrowUp') {
    event.preventDefault(); setVisible(true); void focusItem('last')
  }
}
function handleMenuKeydown(event: KeyboardEvent) {
  const items = getMenuItems(); const current = items.indexOf(document.activeElement as HTMLElement)
  let next = current
  if (event.key === 'ArrowDown') next = (current + 1) % items.length
  else if (event.key === 'ArrowUp') next = (current - 1 + items.length) % items.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = items.length - 1
  else if (event.key === 'Escape') { event.preventDefault(); close(); referenceRef.value?.querySelector<HTMLElement>('*')?.focus(); return }
  else return
  if (items.length) { event.preventDefault(); items[next]?.focus() }
}
function select(command: unknown, event: MouseEvent) {
  emit('command', command, event)
  if (props.hideOnClick) close()
}
provide(mgDropdownKey, { select, close })
function updatePosition() {
  if (!referenceRef.value || !floatingRef.value) return
  const next = computeFloatingPosition(referenceRef.value, floatingRef.value, { placement: props.placement, offset: props.offset })
  position.value = { x: next.x, y: next.y }; resolvedPlacement.value = next.placement
}
function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (!referenceRef.value?.contains(target) && !floatingRef.value?.contains(target)) close()
}
function onDocumentKeydown(event: KeyboardEvent) { if (event.key === 'Escape' && overlayHandle?.isTopmost.value) close() }
watch(actualVisible, async (visible) => {
  if (visible) {
    overlayHandle = overlayManager.open({ type: 'dropdown', close })
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
defineExpose({ show, hide: close, handleOpen: show, handleClose: close, updatePosition, referenceRef, floatingRef })
</script>

<style scoped>
.mg-dropdown { display: inline-flex; align-items: center; color: var(--mg-color-primary, #0052d9); cursor: pointer; outline: none; }
.mg-dropdown__popper { position: fixed; min-width: 120px; overflow: auto; background: #fff; border: 1px solid var(--mg-border-color-light, #e5e7ec); border-radius: var(--mg-border-radius-base, 4px); box-shadow: var(--mg-box-shadow-light, 0 2px 8px rgb(0 0 0 / 12%)); }
.mg-dropdown-fade-enter-active, .mg-dropdown-fade-leave-active { transition: opacity .15s ease, transform .15s ease; }
.mg-dropdown-fade-enter-from, .mg-dropdown-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
