<template>
  <div v-bind="$attrs" class="mg-empty">
    <div class="mg-empty__image" :style="imageStyles" aria-hidden="true">
      <slot name="image">
        <img v-if="image" :src="image" alt="" />
        <svg v-else viewBox="0 0 120 80" role="presentation">
          <path d="M18 56 38 20h44l20 36-14 14H32Z" fill="var(--mg-fill-color-light, #f2f3f5)" stroke="var(--mg-border-color, #d8dbe2)" stroke-width="2" />
          <path d="M18 56h28l7 9h14l7-9h28" fill="none" stroke="var(--mg-border-color, #d8dbe2)" stroke-width="2" />
          <path d="M46 34h28M42 43h36" stroke="var(--mg-color-text-placeholder, #a6abb6)" stroke-linecap="round" stroke-width="3" />
        </svg>
      </slot>
    </div>
    <div class="mg-empty__description"><slot name="description"><p>{{ description }}</p></slot></div>
    <div v-if="$slots.default" class="mg-empty__bottom"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MgEmpty', inheritAttrs: false })
const props = withDefaults(defineProps<{
  description?: string
  image?: string
  imageSize?: number
}>(), { description: '', image: '', imageSize: 120 })
const imageStyles = computed(() => ({ width: `${props.imageSize}px`, height: `${Math.round(props.imageSize * 2 / 3)}px` }))
</script>

<style scoped>
.mg-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; padding: 40px 0; text-align: center; }
.mg-empty__image { display: flex; align-items: center; justify-content: center; max-width: 100%; }
.mg-empty__image img, .mg-empty__image svg { display: block; width: 100%; height: 100%; object-fit: contain; }
.mg-empty__description { margin-top: 20px; color: var(--mg-color-text-secondary, #6f7686); font-size: 14px; line-height: 1.5; }
.mg-empty__description :deep(p) { margin: 0; }
.mg-empty__bottom { margin-top: 20px; }
</style>
