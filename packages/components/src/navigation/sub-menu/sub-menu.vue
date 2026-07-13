<template>
  <section
    v-bind="$attrs"
    :class="['mg-sub-menu', { 'is-opened': opened, 'is-disabled': disabled }]"
  >
    <button
      type="button"
      class="mg-sub-menu__title"
      :disabled="disabled"
      :aria-expanded="opened"
      @click="context?.toggle(index)"
    >
      <span><slot name="title" /></span><span class="mg-sub-menu__arrow">⌄</span>
    </button>
    <div v-show="opened" class="mg-sub-menu__items" role="menu"><slot /></div>
  </section>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { menuContextKey } from '../menu/context'
defineOptions({ name: 'MgSubMenu', inheritAttrs: false })
const props = defineProps<{
  index: string
  disabled?: boolean
  popperClass?: string
  showTimeout?: number
  hideTimeout?: number
}>()
const context = inject(menuContextKey)
const opened = computed(() => context?.opened(props.index) ?? false)
</script>
<style scoped>
.mg-sub-menu__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  padding: 0 20px;
  color: inherit;
  font: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.mg-sub-menu__title:not(:disabled):hover {
  background: var(--mg-color-fill-light, #f5f6f7);
}
.mg-sub-menu__title:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.mg-sub-menu__title:focus-visible { outline: none; box-shadow: inset var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-sub-menu__title:not(:disabled):active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-sub-menu__arrow {
  transition: transform 0.2s;
}
.is-opened > .mg-sub-menu__title .mg-sub-menu__arrow {
  transform: rotate(180deg);
}
.mg-sub-menu__items {
  padding-left: 16px;
}
.mg-menu--horizontal > .mg-sub-menu {
  position: relative;
}
.mg-menu--horizontal > .mg-sub-menu > .mg-sub-menu__items {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  min-width: 180px;
  padding: 6px;
  background: #fff;
  border: 1px solid var(--mg-color-border-light, #ebecef);
  box-shadow: 0 6px 18px rgb(0 0 0 / 12%);
}
</style>
