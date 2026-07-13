<template>
  <div v-bind="$attrs" :class="['mg-step', `is-${currentStatus}`, `is-${steps?.direction.value ?? 'horizontal'}`]" :style="stepStyles">
    <div class="mg-step__head">
      <div class="mg-step__line" aria-hidden="true"><span /></div>
      <div class="mg-step__icon" aria-hidden="true">
        <slot name="icon"><component :is="icon" v-if="icon && typeof icon !== 'string'" /><template v-else-if="icon">{{ icon }}</template><template v-else>{{ statusIcon }}</template></slot>
      </div>
    </div>
    <div class="mg-step__main">
      <div v-if="$slots.title || title" class="mg-step__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="$slots.description || description" class="mg-step__description"><slot name="description">{{ description }}</slot></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, type Component } from 'vue'
import { mgStepsKey, type MgStepStatus } from '../steps/context'

defineOptions({ name: 'MgStep', inheritAttrs: false })
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string | Component
  status?: MgStepStatus
  space?: string | number
}>(), { title: '', description: '', icon: '', space: '' })
const steps = inject(mgStepsKey, undefined)
const id = Symbol('mg-step')
onMounted(() => steps?.register(id))
onBeforeUnmount(() => steps?.unregister(id))
const index = computed(() => Math.max(0, steps?.indexOf(id) ?? 0))
const currentStatus = computed<MgStepStatus>(() => {
  if (props.status) return props.status
  if (!steps) return 'wait'
  if (index.value < steps.active.value) return steps.finishStatus.value
  if (index.value === steps.active.value) return steps.processStatus.value
  return 'wait'
})
const statusIcon = computed(() => currentStatus.value === 'success' ? '✓' : currentStatus.value === 'error' ? '×' : index.value + 1)
const cssSpace = computed(() => {
  const value = props.space || steps?.space.value
  return typeof value === 'number' ? `${value}px` : value || undefined
})
const stepStyles = computed(() => steps?.direction.value === 'vertical'
  ? { height: cssSpace.value, flexBasis: cssSpace.value }
  : { width: cssSpace.value, flexBasis: cssSpace.value })
</script>

<style scoped>
.mg-step { position: relative; display: flex; flex: 1; min-width: 0; color: var(--mg-color-text-placeholder, #a6abb6); }
.mg-step.is-horizontal { flex-direction: column; }
.mg-step.is-vertical { min-height: 80px; }
.mg-step__head { position: relative; flex: 0 0 auto; }
.mg-step__icon { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 28px; height: 28px; font-weight: 600; background: #fff; border: 2px solid currentcolor; border-radius: 50%; }
.mg-step__line { position: absolute; background: var(--mg-border-color-light, #e5e7ec); }
.mg-step__line span { display: block; width: 0; height: 100%; background: currentcolor; transition: width .25s ease, height .25s ease; }
.mg-step.is-horizontal .mg-step__line { top: 13px; left: 28px; width: calc(100% - 28px); height: 2px; }
.mg-step.is-vertical .mg-step__line { top: 28px; bottom: 0; left: 13px; width: 2px; }
.mg-step.is-vertical .mg-step__line span { width: 100%; height: 0; }
.mg-step.is-finish .mg-step__line span, .mg-step.is-success .mg-step__line span { width: 100%; height: 100%; }
.mg-step__main { min-width: 0; padding-top: 10px; padding-right: 12px; }
.mg-step.is-vertical .mg-step__main { padding: 3px 0 24px 12px; }
.mg-step__title { color: currentcolor; font-size: 16px; font-weight: 500; line-height: 1.4; }
.mg-step__description { margin-top: 4px; color: var(--mg-color-text-secondary, #6f7686); font-size: 13px; line-height: 1.5; }
.mg-step.is-process { color: var(--mg-color-primary, #0052d9); }
.mg-step.is-finish, .mg-step.is-success { color: var(--mg-color-success, #2ba471); }
.mg-step.is-error { color: var(--mg-color-danger, #d54941); }
</style>
