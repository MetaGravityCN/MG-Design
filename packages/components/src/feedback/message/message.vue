<template>
  <Transition name="mg-message" appear @after-leave="emit('destroy')">
    <div
      v-if="visible"
      :class="['mg-message', `is-${type}`, customClass, { 'is-center': center, 'is-plain': plain }]"
      :style="{ top: `${top}px`, zIndex }"
      :role="type === 'error' ? 'alert' : 'status'"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <span class="mg-message__icon" aria-hidden="true">{{ iconText }}</span>
      <div class="mg-message__content">
        <span v-if="dangerouslyUseHTMLString" v-html="String(message)" />
        <slot v-else>{{ message }}</slot>
      </div>
      <span v-if="repeatNum > 1" class="mg-message__repeat">×{{ repeatNum }}</span>
      <button v-if="showClose" class="mg-message__close" type="button" aria-label="关闭消息" @click="close">×</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type MgMessageType = 'success' | 'warning' | 'info' | 'error'
defineOptions({ name: 'MgMessageView' })
const props = withDefaults(defineProps<{
  message?: unknown
  type?: MgMessageType
  duration?: number
  showClose?: boolean
  center?: boolean
  plain?: boolean
  customClass?: string
  dangerouslyUseHTMLString?: boolean
  top?: number
  zIndex?: number
  repeatNum?: number
}>(), {
  message: () => '', type: 'info', duration: 3000, showClose: false, center: false, plain: false,
  customClass: '', dangerouslyUseHTMLString: false, top: 20, zIndex: 2000, repeatNum: 1,
})
const emit = defineEmits<{ close: []; destroy: [] }>()
const visible = ref(false)
const iconText = computed(() => ({ success: '✓', warning: '!', info: 'i', error: '×' })[props.type])
let timer: ReturnType<typeof setTimeout> | undefined
function clearTimer() { clearTimeout(timer); timer = undefined }
function startTimer() { clearTimer(); if (props.duration > 0) timer = setTimeout(close, props.duration) }
function close() { if (!visible.value) return; clearTimer(); visible.value = false; emit('close') }
onMounted(() => { visible.value = true; startTimer() })
onBeforeUnmount(clearTimer)
defineExpose({ close })
</script>

<style scoped>
.mg-message { position: fixed; left: 50%; display: flex; align-items: center; gap: 10px; box-sizing: border-box; min-width: 320px; max-width: min(560px, calc(100vw - 32px)); padding: 12px 16px; color: var(--mg-color-text-regular, #4e5669); background: #f4f6fa; border: 1px solid #e2e6ef; border-radius: var(--mg-border-radius-base, 4px); box-shadow: var(--mg-box-shadow-light, 0 2px 8px rgb(0 0 0 / 12%)); transform: translateX(-50%); transition: top .2s ease; }
.mg-message.is-center { justify-content: center; text-align: center; }
.mg-message.is-success { color: var(--mg-color-success, #2ba471); background: #edf8f3; border-color: #c6ebda; }
.mg-message.is-warning { color: var(--mg-color-warning, #ed7b2f); background: #fff5eb; border-color: #f9d9c4; }
.mg-message.is-error { color: var(--mg-color-danger, #d54941); background: #fff0ed; border-color: #f7ceca; }
.mg-message.is-plain { background: #fff; }
.mg-message__icon { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 18px; height: 18px; font-weight: 700; border: 1px solid currentcolor; border-radius: 50%; }
.mg-message__content { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.mg-message__repeat { flex: 0 0 auto; font-size: 12px; opacity: .75; }
.mg-message__close { flex: 0 0 auto; padding: 0; color: currentcolor; font: inherit; font-size: 20px; cursor: pointer; background: transparent; border: 0; opacity: .7; }
.mg-message__close:hover { opacity: 1; }
.mg-message__close:focus-visible { border-radius: 2px; outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); opacity: 1; }
.mg-message__close:active { transform: scale(.9); }
.mg-message-enter-active, .mg-message-leave-active { transition: opacity .2s ease, transform .2s ease; }
.mg-message-enter-from, .mg-message-leave-to { opacity: 0; transform: translate(-50%, -12px); }
@media (max-width: 480px) { .mg-message { min-width: 0; width: calc(100vw - 32px); } }
</style>
