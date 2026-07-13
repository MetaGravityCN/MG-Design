<template>
  <header class="mg-page-header">
    <div v-if="$slots.breadcrumb" class="mg-page-header__breadcrumb"><slot name="breadcrumb" /></div>
    <div class="mg-page-header__row">
      <div class="mg-page-header__main">
        <button v-if="showBack" class="mg-page-header__back" type="button" :aria-label="title || '返回'" @click="emit('back')">
          <slot name="icon">
            <component :is="icon" v-if="icon && typeof icon !== 'string'" />
            <span v-else-if="typeof icon === 'string' && icon" aria-hidden="true">{{ icon }}</span>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </slot>
          <span v-if="title" class="mg-page-header__title"><slot name="title">{{ title }}</slot></span>
        </button>
        <div class="mg-page-header__content-wrap">
          <div v-if="content || $slots.content" class="mg-page-header__content"><slot name="content">{{ content }}</slot></div>
          <p v-if="description" class="mg-page-header__description">{{ description }}</p>
          <slot />
        </div>
      </div>
      <div v-if="$slots.extra" class="mg-page-header__extra"><slot name="extra" /></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

defineOptions({ name: 'MgPageHeader' })
const props = withDefaults(defineProps<{ title?: string; content?: string; description?: string; icon?: string | Component }>(), { title: '返回' })
const emit = defineEmits<{ back: [] }>()
const showBack = computed(() => props.icon !== '' && Boolean(props.title || props.icon))
</script>

<style scoped>
.mg-page-header { margin-bottom: 16px; }
.mg-page-header__breadcrumb { margin-bottom: 12px; }
.mg-page-header__row, .mg-page-header__main, .mg-page-header__back, .mg-page-header__extra { display: flex; align-items: center; }
.mg-page-header__row { justify-content: space-between; gap: 24px; }
.mg-page-header__main { min-width: 0; gap: 16px; }
.mg-page-header__back { flex: none; gap: 6px; border: 0; padding: 4px 0; color: var(--mg-color-text-primary); background: transparent; font: inherit; cursor: pointer; }
.mg-page-header__back:hover { color: var(--mg-color-primary); }
.mg-page-header__back svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; }
.mg-page-header__title { font-size: 14px; white-space: nowrap; }
.mg-page-header__content-wrap { min-width: 0; }
.mg-page-header__content {
  color: var(--mg-color-text-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}
.mg-page-header__description {
  margin: 6px 0 0;
  color: var(--mg-color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}
.mg-page-header__extra { flex: none; gap: 8px; }
@media (max-width: 640px) {
  .mg-page-header__row { align-items: stretch; flex-direction: column; }
  .mg-page-header__main { align-items: flex-start; }
  .mg-page-header__extra { justify-content: flex-end; }
}
</style>
