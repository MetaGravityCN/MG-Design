<template>
  <MgPopover
    ref="popoverRef"
    v-model:visible="proxyVisible"
    class="mg-popconfirm-trigger"
    trigger="click"
    :placement="placement"
    :width="width"
    :disabled="disabled"
    :offset="offset"
    :teleported="teleported"
    :append-to="appendTo"
    @visible-change="emit('visible-change', $event)"
  >
    <template #reference><slot name="reference" /></template>
    <div class="mg-popconfirm" role="alertdialog" :aria-labelledby="titleId">
      <div class="mg-popconfirm__main">
        <span v-if="!hideIcon" class="mg-popconfirm__icon" :style="{ color: iconColor }" aria-hidden="true">
          <component :is="icon" v-if="icon && typeof icon !== 'string'" />
          <template v-else>{{ typeof icon === 'string' ? icon : '!' }}</template>
        </span>
        <span :id="titleId" class="mg-popconfirm__title"><slot name="title">{{ title }}</slot></span>
      </div>
      <div class="mg-popconfirm__actions">
        <slot name="actions" :confirm="confirm" :cancel="cancel">
          <button
            class="mg-popconfirm__button"
            :class="`is-${cancelButtonType}`"
            type="button"
            @click="cancel"
          >{{ cancelButtonText }}</button>
          <button
            class="mg-popconfirm__button"
            :class="`is-${confirmButtonType}`"
            type="button"
            @click="confirm"
          >{{ confirmButtonText }}</button>
        </slot>
      </div>
    </div>
  </MgPopover>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch, type Component } from 'vue'
import { useStableId, type FloatingPlacement } from '@metagravity_cn/primitives'
import { MgPopover } from '../popover'

export type MgPopconfirmButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
defineOptions({ name: 'MgPopconfirm', inheritAttrs: false })
const props = withDefaults(defineProps<{
  visible?: boolean
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonType?: MgPopconfirmButtonType
  cancelButtonType?: MgPopconfirmButtonType
  icon?: string | Component
  iconColor?: string
  hideIcon?: boolean
  width?: string | number
  placement?: FloatingPlacement
  disabled?: boolean
  offset?: number
  teleported?: boolean
  appendTo?: string | HTMLElement
}>(), {
  title: '', confirmButtonText: '确定', cancelButtonText: '取消', confirmButtonType: 'primary',
  cancelButtonType: 'text', iconColor: '#e6a23c', hideIcon: false, width: 200,
  placement: 'top', disabled: false, offset: 8, teleported: true, appendTo: 'body',
})
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'visible-change': [value: boolean]
  confirm: [event: MouseEvent]
  cancel: [event: MouseEvent]
}>()
const internalVisible = ref(false)
const popoverRef = ref<InstanceType<typeof MgPopover>>()
const titleId = useStableId(undefined, 'mg-popconfirm-title')
const visibleControlled = Object.prototype.hasOwnProperty.call(getCurrentInstance()?.vnode.props ?? {}, 'visible')
const proxyVisible = computed({
  get: () => visibleControlled ? props.visible === true : internalVisible.value,
  set: (value: boolean) => {
    if (!visibleControlled) internalVisible.value = value
    emit('update:visible', value)
  },
})
watch(() => props.disabled, (disabled) => { if (disabled) proxyVisible.value = false })
function confirm(event: MouseEvent) { emit('confirm', event); proxyVisible.value = false }
function cancel(event: MouseEvent) { emit('cancel', event); proxyVisible.value = false }
function show() { proxyVisible.value = true }
function hide() { proxyVisible.value = false }
defineExpose({ show, hide, popoverRef })
</script>

<style scoped>
.mg-popconfirm { min-width: 168px; }
.mg-popconfirm__main { display: flex; align-items: flex-start; gap: 8px; color: var(--mg-color-text-primary, #272b34); line-height: 1.5; }
.mg-popconfirm__icon { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 16px; height: 16px; margin-top: 2px; font-weight: 700; border: 1px solid currentcolor; border-radius: 50%; }
.mg-popconfirm__title { flex: 1; min-width: 0; }
.mg-popconfirm__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.mg-popconfirm__button { min-height: 26px; padding: 4px 10px; color: var(--mg-color-text-regular, #4e5669); font: inherit; font-size: 12px; cursor: pointer; background: #fff; border: 1px solid var(--mg-border-color, #d8dbe2); border-radius: var(--mg-border-radius-base, 4px); }
.mg-popconfirm__button:hover { color: var(--mg-color-primary, #0052d9); border-color: var(--mg-color-primary, #0052d9); }
.mg-popconfirm__button.is-primary { color: #fff; background: var(--mg-color-primary, #0052d9); border-color: var(--mg-color-primary, #0052d9); }
.mg-popconfirm__button.is-danger { color: #fff; background: var(--mg-color-danger, #d54941); border-color: var(--mg-color-danger, #d54941); }
.mg-popconfirm__button.is-text { padding-inline: 4px; color: var(--mg-color-text-regular, #4e5669); background: transparent; border-color: transparent; }
</style>
