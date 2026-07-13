<template>
  <div v-bind="$attrs" class="mg-loading-container" :aria-busy="loading">
    <slot />
    <Transition name="mg-loading-fade">
      <div
        v-if="loading"
        :class="['mg-loading-mask', customClass]"
        :style="{ background, zIndex }"
        role="status"
        aria-live="polite"
      >
        <div class="mg-loading-content">
          <div :class="['mg-loading-spinner', spinner]" aria-hidden="true">
            <svg v-if="svg" :viewBox="svgViewBox" v-html="svg" />
          </div>
          <p v-if="text" class="mg-loading-text">{{ text }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MgLoading', inheritAttrs: false })
withDefaults(defineProps<{
  loading?: boolean
  text?: string
  background?: string
  spinner?: string
  svg?: string
  svgViewBox?: string
  customClass?: string
  zIndex?: number
}>(), {
  loading: false, text: '', background: 'rgb(255 255 255 / 80%)', spinner: '', svg: '',
  svgViewBox: '0 0 50 50', customClass: '', zIndex: 10,
})
</script>

<style scoped>
.mg-loading-fade-enter-active, .mg-loading-fade-leave-active { transition: opacity .2s ease; }
.mg-loading-fade-enter-from, .mg-loading-fade-leave-to { opacity: 0; }
</style>
