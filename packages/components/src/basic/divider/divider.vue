<template>
  <div
    v-bind="$attrs"
    :class="['mg-divider', `mg-divider--${direction}`, `mg-divider--${contentPosition}`]"
    :style="{ '--mg-divider-border-style': borderStyle }"
    role="separator"
    :aria-orientation="direction"
  >
    <div v-if="$slots.default && direction === 'horizontal'" class="mg-divider__text"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MgDivider', inheritAttrs: false })

withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    contentPosition?: 'left' | 'center' | 'right'
    borderStyle?: string
  }>(),
  { direction: 'horizontal', contentPosition: 'center', borderStyle: 'solid' },
)
</script>

<style scoped>
.mg-divider { --mg-divider-border-style: solid; box-sizing: border-box; position: relative; border-color: var(--mg-color-border-light, #e7e8eb); }
.mg-divider--horizontal { display: flex; align-items: center; width: 100%; margin: 24px 0; border-top: 1px var(--mg-divider-border-style) var(--mg-color-border-light, #e7e8eb); }
.mg-divider--vertical { display: inline-block; width: 1px; height: 1em; margin: 0 8px; vertical-align: middle; border-left: 1px var(--mg-divider-border-style) var(--mg-color-border-light, #e7e8eb); }
.mg-divider__text { position: absolute; padding: 0 16px; color: var(--mg-color-text-primary, #272b34); font-size: 14px; background: var(--mg-color-white, #fff); }
.mg-divider--left .mg-divider__text { left: 20px; }
.mg-divider--center .mg-divider__text { left: 50%; transform: translateX(-50%); }
.mg-divider--right .mg-divider__text { right: 20px; }
</style>
