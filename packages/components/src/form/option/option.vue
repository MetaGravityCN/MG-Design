<template>
  <div
    v-show="isVisible"
    v-bind="$attrs"
    :id="id"
    :class="classes"
    role="option"
    :aria-selected="isSelected"
    :aria-disabled="disabled || undefined"
    @click="choose"
    @mousemove="highlight"
  >
    <slot>{{ label ?? String(value) }}</slot>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, reactive } from 'vue'
import { useStableId } from '@mg-design/primitives'
import { selectContextKey } from '../select-context'
import type { SelectionValue } from '../selection-context'
defineOptions({ name: 'MgOption', inheritAttrs: false })
const props = defineProps<{ value: SelectionValue; label?: string | number; disabled?: boolean }>()
const select = inject(selectContextKey)
const id = useStableId('mg-option')
const record = reactive({
  value: props.value,
  label: String(props.label ?? props.value ?? ''),
  disabled: Boolean(props.disabled),
  id,
})
const isSelected = computed(() => select?.selected(props.value))
const isVisible = computed(() => select?.visible(record) ?? true)
const classes = computed(() => [
  'mg-option',
  {
    'is-selected': isSelected.value,
    'is-disabled': props.disabled,
    'is-highlighted': select?.highlightedId.value === id,
  },
])
function choose() {
  if (!props.disabled) select?.select(record)
}
function highlight() {}
onMounted(() => select?.register(record))
onBeforeUnmount(() => select?.unregister(id))
</script>
<style scoped>
.mg-option {
  box-sizing: border-box;
  min-height: 34px;
  padding: 7px 12px;
  overflow: hidden;
  color: var(--mg-color-text-regular, #424a57);
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.mg-option:not(.is-disabled):hover,
.mg-option.is-highlighted {
  background: var(--mg-color-fill-light, #f5f6f7);
}
.mg-option.is-selected {
  color: var(--mg-color-primary, #0052d9);
  font-weight: 600;
}
.mg-option.is-disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.mg-option:not(.is-disabled):active { background: var(--mg-color-fill-active, #d9e1ff); }
</style>
