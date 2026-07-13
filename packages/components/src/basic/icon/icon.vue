<template>
  <i v-bind="$attrs" :class="['mg-icon', { 'is-loading': loading }]" :style="iconStyles" :role="label ? 'img' : undefined" :aria-label="label" :aria-hidden="label ? undefined : 'true'">
    <slot v-if="$slots.default" />
    <svg v-else-if="name" viewBox="0 0 24 24" focusable="false"><path :d="resolvedPath" /></svg>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MgIcon', inheritAttrs: false })
const props = defineProps<{ size?: number | string; color?: string; name?: string; loading?: boolean; label?: string }>()
const paths: Record<string, string> = {
  House: 'M3 11.2 12 3l9 8.2V21h-6v-6H9v6H3v-9.8Z',
  User: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0H4Z',
  Setting: 'M10.8 2h2.4l.5 2.1 1.5.6L17 3.5l1.7 1.7-1.2 1.8.6 1.5 2.1.5v2.4l-2.1.5-.6 1.5 1.2 1.8-1.7 1.7-1.8-1.2-1.5.6-.5 2.1h-2.4l-.5-2.1-1.5-.6-1.8 1.2-1.7-1.7L6.5 15l-.6-1.5-2.1-.5v-2.4l2.1-.5.6-1.5-1.2-1.8L7 5.1l1.8 1.2 1.5-.6.5-2.1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  Search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L20 21l1-1-4.7-4.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
  Edit: 'm4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5ZM17 3l4 4-1.5 1.5-4-4L17 3Z',
  Check: 'm9.5 18-6-6 1.8-1.8 4.2 4.2 9.2-9.2 1.8 1.8-11 11Z',
  Star: 'm12 2.5 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1 3-6.1Z',
  Delete: 'M7 7h2v11H7V7Zm4 0h2v11h-2V7Zm4 0h2v11h-2V7ZM5 4h14v2H5V4Zm3-2h8l1 2H7l1-2ZM6 20h12v2H6v-2Z',
  ArrowDown: 'm5 8 7 7 7-7H5Z',
  Plus: 'M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z',
  UploadFilled: 'M12 3 6 9h4v6h4V9h4l-6-6ZM5 18h14v3H5v-3Z',
}
const resolvedPath = computed(() => paths[props.name ?? ''] ?? paths.Plus)
const normalizeSize = (size?: number | string) => typeof size === 'number' ? `${size}px` : size
const iconStyles = computed(() => ({ fontSize: normalizeSize(props.size), color: props.color }))
</script>

<style scoped>
.mg-icon { display: inline-flex; align-items: center; justify-content: center; width: 1em; height: 1em; font-size: inherit; line-height: 1; color: inherit; fill: currentColor; }
.mg-icon :deep(svg) { width: 1em; height: 1em; fill: currentColor; }
.mg-icon.is-loading { animation: mg-icon-spin 1.5s linear infinite; }
@keyframes mg-icon-spin { to { transform: rotate(360deg); } }
</style>
