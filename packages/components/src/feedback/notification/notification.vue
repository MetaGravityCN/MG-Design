<template>
  <Transition name="mg-notification-fade" appear @after-leave="emit('destroy')"
    ><aside
      v-if="visible"
      :class="['mg-notification', `is-${type}`, `is-${position}`]"
      :style="style"
      role="status"
      @mouseenter="stopTimer"
      @mouseleave="startTimer"
    >
      <div class="mg-notification__body">
        <h3 v-if="title">{{ title }}</h3>
        <div class="mg-notification__message">{{ message }}</div>
      </div>
      <button v-if="showClose" type="button" aria-label="关闭通知" @click="close">×</button>
    </aside></Transition
  >
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    type?: 'success' | 'warning' | 'info' | 'error' | ''
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    duration?: number
    showClose?: boolean
    offset?: number
    style?: CSSProperties
    onClose?: () => void
    onClick?: () => void
  }>(),
  { message: '', type: '', position: 'top-right', duration: 4500, showClose: true, offset: 16 }
)
const emit = defineEmits<{ close: []; destroy: [] }>()
const visible = ref(true)
let timer: ReturnType<typeof setTimeout> | undefined
function stopTimer() {
  if (timer) clearTimeout(timer)
  timer = undefined
}
function startTimer() {
  stopTimer()
  if (props.duration > 0) timer = setTimeout(close, props.duration)
}
function close() {
  if (!visible.value) return
  visible.value = false
  props.onClose?.()
  emit('close')
}
onMounted(startTimer)
onBeforeUnmount(stopTimer)
defineExpose({ close })
</script>
<style scoped>
.mg-notification {
  position: fixed;
  z-index: 2200;
  display: flex;
  gap: 14px;
  box-sizing: border-box;
  width: 330px;
  padding: 16px 18px;
  color: var(--mg-color-text-regular, #424a57);
  background: #fff;
  border: 1px solid var(--mg-color-border-light, #ebecef);
  border-left: 4px solid var(--mg-color-primary, #0052d9);
  border-radius: 7px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 14%);
}
.mg-notification.is-success {
  border-left-color: var(--mg-color-success, #2ba471);
}
.mg-notification.is-warning {
  border-left-color: var(--mg-color-warning, #d99000);
}
.mg-notification.is-error {
  border-left-color: var(--mg-color-danger, #d54941);
}
.mg-notification__body {
  flex: 1;
  min-width: 0;
}
.mg-notification h3 {
  margin: 0 0 6px;
  color: var(--mg-color-text-primary, #202633);
  font-size: 16px;
}
.mg-notification__message {
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.mg-notification > button {
  align-self: flex-start;
  padding: 0;
  color: var(--mg-color-text-placeholder, #a1a7b3);
  font-size: 20px;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.mg-notification > button:hover { color: var(--mg-color-text-primary, #272b34); }
.mg-notification > button:focus-visible { border-radius: 2px; outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-notification > button:active { transform: scale(.9); }
.mg-notification-fade-enter-active,
.mg-notification-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.mg-notification-fade-enter-from,
.mg-notification-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
