<template>
  <div v-if="displayedLoading" v-bind="$attrs" :class="['mg-skeleton', { 'is-animated': animated }]" aria-busy="true">
    <div v-for="item in safeCount" :key="item" class="mg-skeleton__template">
      <slot name="template">
        <MgSkeletonItem variant="h3" style="width: 33%" />
        <MgSkeletonItem v-for="row in safeRows" :key="row" variant="text" :style="row === safeRows ? { width: '61%' } : undefined" />
      </slot>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import MgSkeletonItem from './skeleton-item.vue'

defineOptions({ name: 'MgSkeleton', inheritAttrs: false })
const props = withDefaults(defineProps<{
  animated?: boolean
  count?: number
  loading?: boolean
  rows?: number
  throttle?: number
}>(), { animated: false, count: 1, loading: true, rows: 3, throttle: 0 })
const displayedLoading = ref(props.loading && props.throttle <= 0)
const safeCount = computed(() => Math.max(1, Math.floor(props.count)))
const safeRows = computed(() => Math.max(0, Math.floor(props.rows)))
let timer: ReturnType<typeof setTimeout> | undefined
watch(() => props.loading, (loading) => {
  clearTimeout(timer)
  if (!loading) { displayedLoading.value = false; return }
  if (props.throttle <= 0) displayedLoading.value = true
  else timer = setTimeout(() => { displayedLoading.value = true }, props.throttle)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.mg-skeleton { width: 100%; }
.mg-skeleton__template { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.mg-skeleton__template:last-child { margin-bottom: 0; }
.mg-skeleton.is-animated :deep(.mg-skeleton-item) { background: linear-gradient(90deg, var(--mg-fill-color, #edf0f5) 25%, var(--mg-fill-color-light, #f7f8fa) 37%, var(--mg-fill-color, #edf0f5) 63%); background-size: 400% 100%; animation: mg-skeleton-loading 1.4s ease infinite; }
@keyframes mg-skeleton-loading { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
</style>
