<template>
  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition :name="`mg-drawer-${direction}`" @after-enter="emit('opened')" @after-leave="handleClosed">
      <div
        v-if="shouldRender"
        v-show="modelValue"
        :class="['mg-drawer-overlay', modalClass, { 'is-modal': modal }]"
        :style="{ zIndex: resolvedZIndex }"
        @pointerdown.self="handleModalPointerDown"
        @pointerup.self="handleModalPointerUp"
      >
        <section
          ref="drawerRef"
          v-bind="$attrs"
          :class="['mg-drawer', `is-${direction}`]"
          :style="drawerStyles"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="withHeader ? titleId : undefined"
          tabindex="-1"
        >
          <header v-if="withHeader" class="mg-drawer__header">
            <div :id="titleId" class="mg-drawer__title"><slot name="header"><slot name="title">{{ title }}</slot></slot></div>
            <button v-if="showClose" class="mg-drawer__close" type="button" aria-label="关闭抽屉" @click="requestClose">×</button>
          </header>
          <div class="mg-drawer__body"><slot /></div>
          <footer v-if="$slots.footer" class="mg-drawer__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { lockDocumentScroll, overlayManager, useFocusTrap, useStableId, type OverlayHandle } from '@mg-design/primitives'

export type MgDrawerDirection = 'ltr' | 'rtl' | 'ttb' | 'btt'
export type MgDrawerBeforeClose = (done: () => void) => void | boolean | Promise<void | boolean>
defineOptions({ name: 'MgDrawer', inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean; direction?: MgDrawerDirection; size?: string | number; withHeader?: boolean
  title?: string; modal?: boolean; lockScroll?: boolean; closeOnClickModal?: boolean
  closeOnPressEscape?: boolean; showClose?: boolean; beforeClose?: MgDrawerBeforeClose
  destroyOnClose?: boolean; appendTo?: string | HTMLElement; teleported?: boolean; modalClass?: string; zIndex?: number
}>(), {
  modelValue: false, direction: 'rtl', size: '30%', withHeader: true, title: '', modal: true,
  lockScroll: true, closeOnClickModal: true, closeOnPressEscape: true, showClose: true,
  destroyOnClose: false, appendTo: 'body', teleported: true, modalClass: '',
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]; open: []; opened: []; close: []; closed: []
  'open-auto-focus': []; 'close-auto-focus': []
}>()
const drawerRef = ref<HTMLElement>()
const shouldRender = ref(props.modelValue || !props.destroyOnClose)
const titleId = useStableId(undefined, 'mg-drawer-title')
const resolvedZIndex = ref(props.zIndex ?? 2001)
let overlayHandle: OverlayHandle | undefined
let unlockScroll: (() => void) | undefined
let modalPointerStarted = false
let closing = false

const toCssSize = (value: string | number) => typeof value === 'number' ? `${value}px` : value
const drawerStyles = computed(() => ['ltr', 'rtl'].includes(props.direction)
  ? { width: toCssSize(props.size) }
  : { height: toCssSize(props.size) })

useFocusTrap(drawerRef, {
  active: computed(() => props.modelValue),
  onEscape: () => {
    if (props.closeOnPressEscape && overlayHandle?.isTopmost.value) void requestClose()
  },
})

watch(() => props.modelValue, async (visible) => {
  if (visible) {
    closing = false
    shouldRender.value = true
    overlayHandle = overlayManager.open({ type: 'drawer', close: () => void requestClose() })
    resolvedZIndex.value = props.zIndex ?? overlayHandle.record.zIndex
    if (props.lockScroll) unlockScroll = lockDocumentScroll()
    emit('open')
    await nextTick(); emit('open-auto-focus')
  } else if (shouldRender.value) emit('close')
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
  } catch { closing = false }
}

function handleModalPointerDown() { modalPointerStarted = true }
function handleModalPointerUp() {
  if (modalPointerStarted && props.closeOnClickModal) void requestClose()
  modalPointerStarted = false
}
function handleClosed() {
  overlayHandle?.release(); overlayHandle = undefined
  unlockScroll?.(); unlockScroll = undefined
  if (props.destroyOnClose) shouldRender.value = false
  closing = false
  emit('closed'); emit('close-auto-focus')
}
onBeforeUnmount(() => { overlayHandle?.release(); unlockScroll?.() })
defineExpose({ drawerRef })
</script>

<style scoped>
.mg-drawer-overlay { position: fixed; inset: 0; overflow: hidden; }
.mg-drawer-overlay.is-modal { background: rgb(0 0 0 / 45%); }
.mg-drawer-overlay:not(.is-modal) { pointer-events: none; }
.mg-drawer { position: absolute; display: flex; flex-direction: column; box-sizing: border-box; max-width: 100vw; max-height: 100vh; color: var(--mg-color-text-primary, #272b34); background: #fff; box-shadow: var(--mg-box-shadow-dark, 0 4px 16px rgb(0 0 0 / 8%)); outline: none; pointer-events: auto; }
.mg-drawer.is-rtl { top: 0; right: 0; bottom: 0; }
.mg-drawer.is-ltr { top: 0; bottom: 0; left: 0; }
.mg-drawer.is-ttb { top: 0; right: 0; left: 0; }
.mg-drawer.is-btt { right: 0; bottom: 0; left: 0; }
.mg-drawer__header { display: flex; align-items: center; gap: 16px; flex-shrink: 0; padding: 20px 24px 16px; }
.mg-drawer__title { flex: 1; min-width: 0; font-size: 18px; font-weight: 600; }
.mg-drawer__close { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; color: var(--mg-color-text-secondary, #6f7686); font: inherit; font-size: 24px; cursor: pointer; background: transparent; border: 0; border-radius: 3px; }
.mg-drawer__close:hover { color: var(--mg-color-primary, #0052d9); background: var(--mg-color-primary-light-9, #f2f3ff); }
.mg-drawer__body { flex: 1; min-height: 0; padding: 16px 24px 24px; overflow: auto; }
.mg-drawer__footer { flex-shrink: 0; padding: 12px 24px 20px; text-align: right; }
.mg-drawer-rtl-enter-active, .mg-drawer-rtl-leave-active, .mg-drawer-ltr-enter-active, .mg-drawer-ltr-leave-active, .mg-drawer-ttb-enter-active, .mg-drawer-ttb-leave-active, .mg-drawer-btt-enter-active, .mg-drawer-btt-leave-active { transition: opacity .25s ease; }
.mg-drawer-rtl-enter-active .mg-drawer, .mg-drawer-rtl-leave-active .mg-drawer, .mg-drawer-ltr-enter-active .mg-drawer, .mg-drawer-ltr-leave-active .mg-drawer, .mg-drawer-ttb-enter-active .mg-drawer, .mg-drawer-ttb-leave-active .mg-drawer, .mg-drawer-btt-enter-active .mg-drawer, .mg-drawer-btt-leave-active .mg-drawer { transition: transform .25s ease; }
.mg-drawer-rtl-enter-from, .mg-drawer-rtl-leave-to, .mg-drawer-ltr-enter-from, .mg-drawer-ltr-leave-to, .mg-drawer-ttb-enter-from, .mg-drawer-ttb-leave-to, .mg-drawer-btt-enter-from, .mg-drawer-btt-leave-to { opacity: 0; }
.mg-drawer-rtl-enter-from .mg-drawer, .mg-drawer-rtl-leave-to .mg-drawer { transform: translateX(100%); }
.mg-drawer-ltr-enter-from .mg-drawer, .mg-drawer-ltr-leave-to .mg-drawer { transform: translateX(-100%); }
.mg-drawer-ttb-enter-from .mg-drawer, .mg-drawer-ttb-leave-to .mg-drawer { transform: translateY(-100%); }
.mg-drawer-btt-enter-from .mg-drawer, .mg-drawer-btt-leave-to .mg-drawer { transform: translateY(100%); }
</style>
