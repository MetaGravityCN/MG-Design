<template>
  <div v-bind="$attrs" :class="['mg-steps', `is-${direction}`, { 'is-align-center': alignCenter, 'is-simple': simple }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, toRef, watch } from 'vue'
import { mgStepsKey, type MgStepStatus } from './context'

export type { MgStepStatus } from './context'
defineOptions({ name: 'MgSteps', inheritAttrs: false })
const props = withDefaults(defineProps<{
  active?: number
  direction?: 'horizontal' | 'vertical'
  space?: string | number
  finishStatus?: MgStepStatus
  processStatus?: MgStepStatus
  alignCenter?: boolean
  simple?: boolean
}>(), { active: 0, direction: 'horizontal', space: '', finishStatus: 'finish', processStatus: 'process', alignCenter: false, simple: false })
const emit = defineEmits<{ change: [current: number, previous: number] }>()
const items = ref<symbol[]>([])
provide(mgStepsKey, {
  active: toRef(props, 'active'), direction: toRef(props, 'direction'), finishStatus: toRef(props, 'finishStatus'),
  processStatus: toRef(props, 'processStatus'), simple: toRef(props, 'simple'), space: toRef(props, 'space'),
  register: (id) => { if (!items.value.includes(id)) items.value.push(id) },
  unregister: (id) => { const index = items.value.indexOf(id); if (index >= 0) items.value.splice(index, 1) },
  indexOf: (id) => items.value.indexOf(id),
})
watch(() => props.active, (current, previous) => emit('change', current, previous))
</script>

<style scoped>
.mg-steps { display: flex; width: 100%; }
.mg-steps.is-horizontal { flex-direction: row; }
.mg-steps.is-vertical { flex-direction: column; height: 100%; }
.mg-steps :deep(.mg-step:last-child .mg-step__line) { display: none; }
</style>
