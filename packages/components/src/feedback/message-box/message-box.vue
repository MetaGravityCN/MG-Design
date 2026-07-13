<template>
  <div class="mg-message-box__overlay" @click.self="closeOnClickModal && cancel('close')">
    <section class="mg-message-box" role="alertdialog" aria-modal="true" :aria-labelledby="titleId">
      <header>
        <h2 :id="titleId">{{ title }}</h2>
        <button v-if="showClose" type="button" aria-label="关闭" @click="cancel('close')">×</button>
      </header>
      <div :class="['mg-message-box__message', type && `is-${type}`]">
        <slot>{{ message }}</slot>
      </div>
      <input
        v-if="showInput"
        ref="inputRef"
        v-model="inputValue"
        class="mg-message-box__input"
        :type="inputType"
        :placeholder="inputPlaceholder"
        @keydown.enter="confirm"
      />
      <p v-if="validationMessage" class="mg-message-box__error">{{ validationMessage }}</p>
      <footer>
        <button
          v-if="showCancelButton"
          type="button"
          class="mg-message-box__cancel"
          @click="cancel('cancel')"
        >
          {{ cancelButtonText }}</button
        ><button
          v-if="showConfirmButton"
          ref="confirmRef"
          type="button"
          class="mg-message-box__confirm"
          @click="confirm"
        >
          {{ confirmButtonText }}
        </button>
      </footer>
    </section>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStableId } from '@metagravity_cn/primitives'
const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    type?: 'success' | 'warning' | 'info' | 'error'
    showCancelButton?: boolean
    showConfirmButton?: boolean
    showClose?: boolean
    closeOnClickModal?: boolean
    closeOnPressEscape?: boolean
    confirmButtonText?: string
    cancelButtonText?: string
    showInput?: boolean
    inputValue?: string
    inputPlaceholder?: string
    inputType?: string
    inputPattern?: RegExp
    inputValidator?: (value: string) => boolean | string
    inputErrorMessage?: string
  }>(),
  {
    title: '提示',
    message: '',
    showConfirmButton: true,
    showClose: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: '',
    inputType: 'text',
    inputErrorMessage: '输入不合法',
  }
)
const emit = defineEmits<{ action: [action: 'confirm' | 'cancel' | 'close', value?: string] }>()
const titleId = useStableId(undefined, 'mg-message-box-title')
const inputRef = ref<HTMLInputElement>()
const confirmRef = ref<HTMLButtonElement>()
const inputValue = ref(props.inputValue)
const validationMessage = ref('')
function validate() {
  if (props.inputPattern && !props.inputPattern.test(inputValue.value))
    return props.inputErrorMessage
  const result = props.inputValidator?.(inputValue.value)
  return typeof result === 'string' ? result : result === false ? props.inputErrorMessage : ''
}
function confirm() {
  validationMessage.value = validate()
  if (!validationMessage.value) emit('action', 'confirm', inputValue.value)
}
function cancel(action: 'cancel' | 'close') {
  emit('action', action)
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnPressEscape) cancel('close')
}
onMounted(() => {
  document.addEventListener('keydown', keydown)
  void nextTick(() => (props.showInput ? inputRef.value : confirmRef.value)?.focus())
})
onBeforeUnmount(() => document.removeEventListener('keydown', keydown))
</script>
<style scoped>
.mg-message-box__overlay {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 45%);
}
.mg-message-box {
  box-sizing: border-box;
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 14px 40px rgb(0 0 0 / 20%);
}
.mg-message-box header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mg-message-box h2 {
  margin: 0;
  font-size: 18px;
}
.mg-message-box header button {
  font-size: 22px;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.mg-message-box header button:hover { color: var(--mg-color-danger, #d54941); }
.mg-message-box header button:focus-visible, .mg-message-box footer button:focus-visible { outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-message-box__message {
  margin: 18px 0;
  color: var(--mg-color-text-regular, #424a57);
}
.mg-message-box__input {
  box-sizing: border-box;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 4px;
}
.mg-message-box__input:hover { border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-message-box__input:focus-visible { border-color: var(--mg-color-control-focus-border, #0052d9); outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-message-box__error {
  margin: 6px 0 0;
  color: var(--mg-color-danger, #d54941);
  font-size: 12px;
}
.mg-message-box footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
.mg-message-box footer button {
  min-width: 72px;
  height: 34px;
  cursor: pointer;
  border-radius: 4px;
}
.mg-message-box__cancel {
  background: #fff;
  border: 1px solid var(--mg-color-border, #dcdde1);
}
.mg-message-box__confirm {
  color: #fff;
  background: var(--mg-color-primary, #0052d9);
  border: 1px solid var(--mg-color-primary, #0052d9);
}
.mg-message-box__cancel:hover { color: var(--mg-color-primary, #0052d9); border-color: var(--mg-color-control-hover-border, #8eabff); }
.mg-message-box__confirm:hover { background: var(--mg-color-primary-hover, #618dff); border-color: var(--mg-color-primary-hover, #618dff); }
.mg-message-box__cancel:active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-message-box__confirm:active { background: var(--mg-color-primary-active, #003cab); border-color: var(--mg-color-primary-active, #003cab); }
</style>
