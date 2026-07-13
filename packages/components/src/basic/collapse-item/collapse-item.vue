<template>
  <section
    v-bind="$attrs"
    :class="['mg-collapse-item', { 'is-active': active, 'is-disabled': disabled }]"
  >
    <h3 class="mg-collapse-item__header">
      <button
        type="button"
        :id="headerId"
        :disabled="disabled"
        :aria-expanded="active"
        :aria-controls="contentId"
        @click="context?.toggle(name)"
      >
        <span
          ><slot name="title">{{ title }}</slot></span
        ><span class="mg-collapse-item__arrow">⌄</span>
      </button>
    </h3>
    <div
      v-show="active"
      :id="contentId"
      class="mg-collapse-item__content"
      role="region"
      :aria-labelledby="headerId"
    >
      <slot />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStableId } from '@metagravity_cn/primitives'
import { collapseContextKey, type CollapseName } from '../collapse/context'
defineOptions({ name: 'MgCollapseItem', inheritAttrs: false })
const props = defineProps<{ name: CollapseName; title?: string; disabled?: boolean }>()
const context = inject(collapseContextKey)
const headerId = useStableId(undefined, 'mg-collapse-header')
const contentId = useStableId(undefined, 'mg-collapse-content')
const active = computed(() => context?.isActive(props.name) ?? false)
</script>
<style scoped>
.mg-collapse-item {
  border-bottom: 1px solid var(--mg-color-border-light, #ebecef);
}
.mg-collapse-item:last-child {
  border-bottom: 0;
}
.mg-collapse-item__header {
  margin: 0;
}
.mg-collapse-item__header button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 48px;
  padding: 0;
  color: var(--mg-color-text-primary, #202633);
  font: inherit;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.mg-collapse-item__header button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.mg-collapse-item__header button:not(:disabled):hover { color: var(--mg-color-primary, #0052d9); background: var(--mg-color-fill-hover, #f2f3ff); }
.mg-collapse-item__header button:focus-visible { outline: none; box-shadow: inset var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-collapse-item__header button:not(:disabled):active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-collapse-item__arrow {
  transition: transform 0.2s;
}
.is-active .mg-collapse-item__arrow {
  transform: rotate(180deg);
}
.mg-collapse-item__content {
  padding: 0 0 20px;
  color: var(--mg-color-text-regular, #424a57);
}
</style>
