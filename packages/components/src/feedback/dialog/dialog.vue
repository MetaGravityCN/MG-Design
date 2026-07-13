<template>
  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="mg-dialog-fade" @after-enter="handleOpened" @after-leave="handleClosed">
      <div
        v-if="shouldRender"
        v-show="modelValue"
        :class="['mg-dialog-overlay', modalClass, { 'is-modal': modal }]"
        :style="{ zIndex: resolvedZIndex }"
        @pointerdown.self="handleModalPointerDown"
        @pointerup.self="handleModalPointerUp"
      >
        <div
          ref="dialogRef"
          v-bind="$attrs"
          :class="['mg-dialog', { 'is-fullscreen': fullscreen, 'is-draggable': draggable }]"
          :style="dialogStyles"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="$slots.header || title ? titleId : undefined"
          tabindex="-1"
        >
          <header v-if="$slots.header || title || showClose" class="mg-dialog__header" @pointerdown="startDrag">
            <div :id="titleId" class="mg-dialog__title"><slot name="header">{{ title }}</slot></div>
            <button v-if="showClose" class="mg-dialog__close" type="button" aria-label="关闭对话框" @click="requestClose">×</button>
          </header>
          <div class="mg-dialog__body"><slot /></div>
          <footer v-if="$slots.footer" class="mg-dialog__footer"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { lockDocumentScroll, overlayManager, useFocusTrap, useStableId, type OverlayHandle } from '@metagravity_cn/primitives'

export type MgDialogBeforeClose = (done: () => void) => void | boolean | Promise<void | boolean>
defineOptions({ name: 'MgDialog', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean; title?: string; width?: string | number; top?: string | number
  modal?: boolean; lockScroll?: boolean; closeOnClickModal?: boolean; closeOnPressEscape?: boolean
  showClose?: boolean; beforeClose?: MgDialogBeforeClose; draggable?: boolean; fullscreen?: boolean
  destroyOnClose?: boolean; appendTo?: string | HTMLElement; teleported?: boolean; modalClass?: string; zIndex?: number
}>(), {
  modelValue: false, title: '', width: '50%', top: '15vh', modal: true, lockScroll: true,
  closeOnClickModal: true, closeOnPressEscape: true, showClose: true, draggable: false,
  fullscreen: false, destroyOnClose: false, appendTo: 'body', teleported: true, modalClass: '',
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]; open: []; opened: []; close: []; closed: []
  'open-auto-focus': []; 'close-auto-focus': []
}>()

const dialogRef = ref<HTMLElement>()
const shouldRender = ref(props.modelValue || !props.destroyOnClose)
const titleId = useStableId(undefined, 'mg-dialog-title')
const dragX = ref(0)
const dragY = ref(0)
const resolvedZIndex = ref(props.zIndex ?? 2001)
let overlayHandle: OverlayHandle | undefined
let unlockScroll: (() => void) | undefined
let modalPointerStarted = false
let closing = false

const toCssSize = (value: string | number) => typeof value === 'number' ? `${value}px` : value
const dialogStyles = computed(() => props.fullscreen ? undefined : {
  width: toCssSize(props.width),
  marginTop: toCssSize(props.top),
  transform: `translate(${dragX.value}px, ${dragY.value}px)`,
})

useFocusTrap(dialogRef, {
  active: computed(() => props.modelValue),
  onEscape: () => {
    if (props.closeOnPressEscape && overlayHandle?.isTopmost.value) void requestClose()
  },
})

watch(() => props.modelValue, async (visible) => {
  if (visible) {
    closing = false
    shouldRender.value = true
    dragX.value = 0; dragY.value = 0
    overlayHandle = overlayManager.open({ type: 'dialog', close: () => void requestClose() })
    resolvedZIndex.value = props.zIndex ?? overlayHandle.record.zIndex
    if (props.lockScroll) unlockScroll = lockDocumentScroll()
    emit('open')
    await nextTick()
    emit('open-auto-focus')
  } else if (shouldRender.value) {
    emit('close')
  }
}, { immediate: true })

async function requestClose() {
  if (closing || !props.modelValue) return
  closing = true
  let didClose = false
  const done = () => { if (!didClose) { didClose = true; emit('update:modelValue', false) } }
  if (!props.beforeClose) { done(); return }
  try {
    const result = await props.beforeClose(done)
    if (result === true) done()
    if (result === false) closing = false
  } catch {
    closing = false
  }
}

function handleOpened() { emit('opened') }
function handleClosed() {
  overlayHandle?.release(); overlayHandle = undefined
  unlockScroll?.(); unlockScroll = undefined
  if (props.destroyOnClose) shouldRender.value = false
  closing = false
  emit('closed'); emit('close-auto-focus')
}
function handleModalPointerDown() { modalPointerStarted = true }
function handleModalPointerUp() {
  if (modalPointerStarted && props.closeOnClickModal) void requestClose()
  modalPointerStarted = false
}

function startDrag(event: PointerEvent) {
  if (!props.draggable || props.fullscreen || (event.target as HTMLElement).closest('button, a, input')) return
  event.preventDefault()
  const startX = event.clientX - dragX.value
  const startY = event.clientY - dragY.value
  const move = (moveEvent: PointerEvent) => { dragX.value = moveEvent.clientX - startX; dragY.value = moveEvent.clientY - startY }
  const stop = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', stop) }
  document.addEventListener('pointermove', move)
  document.addEventListener('pointerup', stop)
}

onBeforeUnmount(() => { overlayHandle?.release(); unlockScroll?.() })
defineExpose({ dialogRef, resetPosition: () => { dragX.value = 0; dragY.value = 0 } })
</script>

<style scoped>
.mg-dialog-overlay { position: fixed; inset: 0; display: flex; justify-content: center; align-items: flex-start; overflow: auto; }
.mg-dialog-overlay.is-modal { background: rgb(0 0 0 / 45%); }
.mg-dialog-overlay:not(.is-modal) { pointer-events: none; }
.mg-dialog { box-sizing: border-box; max-width: calc(100vw - 32px); margin-bottom: 15vh; color: var(--mg-color-text-primary, #272b34); background: #fff; border-radius: var(--mg-border-radius-large, 6px); box-shadow: var(--mg-box-shadow-dark, 0 4px 16px rgb(0 0 0 / 8%)); outline: none; pointer-events: auto; }
.mg-dialog.is-fullscreen { width: 100vw; height: 100vh; max-width: none; margin: 0; border-radius: 0; }
.mg-dialog__header { display: flex; align-items: center; gap: 16px; padding: 20px 24px 16px; }
.mg-dialog.is-draggable .mg-dialog__header { cursor: move; user-select: none; }
.mg-dialog__title { flex: 1; min-width: 0; font-size: 18px; font-weight: 600; }
.mg-dialog__close { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; color: var(--mg-color-text-secondary, #6f7686); font: inherit; font-size: 24px; cursor: pointer; background: transparent; border: 0; border-radius: 3px; }
.mg-dialog__close:hover { color: var(--mg-color-primary, #0052d9); background: var(--mg-color-primary-light-9, #f2f3ff); }
.mg-dialog__body { padding: 16px 24px 24px; }
.mg-dialog__footer { padding: 12px 24px 20px; text-align: right; }
.mg-dialog-fade-enter-active, .mg-dialog-fade-leave-active { transition: opacity .2s ease; }
.mg-dialog-fade-enter-active .mg-dialog, .mg-dialog-fade-leave-active .mg-dialog { transition: transform .2s ease, opacity .2s ease; }
.mg-dialog-fade-enter-from, .mg-dialog-fade-leave-to { opacity: 0; }
.mg-dialog-fade-enter-from .mg-dialog, .mg-dialog-fade-leave-to .mg-dialog { opacity: 0; transform: translateY(-16px); }
</style>
