<template>
  <section
    v-bind="$attrs"
    :class="['mg-tabs', type && `mg-tabs--${type}`, `is-${tabPosition}`, { 'is-stretch': stretch }]"
  >
    <div class="mg-tabs__collector"><slot /></div>
    <div class="mg-tabs__header">
      <div class="mg-tabs__nav" role="tablist">
        <button
          v-for="pane in panes"
          :key="pane.id"
          type="button"
          role="tab"
          :class="['mg-tabs__tab', { 'is-active': pane.name === activeName }]"
          :disabled="pane.disabled"
          :aria-selected="pane.name === activeName"
          @click="select(pane, $event)"
        >
          <SlotRenderer v-if="pane.slots.label" :render="pane.slots.label" /><span v-else>{{
            pane.label
          }}</span>
          <span
            v-if="pane.closable || closable"
            class="mg-tabs__close"
            role="button"
            aria-label="关闭标签"
            @click.stop="remove(pane)"
            >×</span
          >
        </button>
        <button
          v-if="addable || editable"
          type="button"
          class="mg-tabs__add"
          aria-label="新增标签"
          @click="add"
        >
          +
        </button>
      </div>
      <slot name="add-icon" />
    </div>
    <div class="mg-tabs__content">
      <SlotRenderer v-if="activePane?.slots.default" :render="activePane.slots.default" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, defineComponent, provide, ref, watch, type Slot } from 'vue'
import { tabsContextKey, type TabName, type TabPaneConfig } from './context'
defineOptions({ name: 'MgTabs', inheritAttrs: false })
const SlotRenderer = defineComponent((props: { render?: Slot }) => () => props.render?.(), {
  props: ['render'],
})
const props = withDefaults(
  defineProps<{
    modelValue?: TabName
    type?: '' | 'card' | 'border-card'
    closable?: boolean
    addable?: boolean
    editable?: boolean
    tabPosition?: 'top' | 'right' | 'bottom' | 'left'
    stretch?: boolean
    beforeLeave?: (activeName: TabName, oldActiveName: TabName) => boolean | Promise<boolean>
  }>(),
  { modelValue: '', type: '', tabPosition: 'top' }
)
const emit = defineEmits<{
  'update:modelValue': [name: TabName]
  'tab-click': [pane: TabPaneConfig, event: MouseEvent]
  'tab-change': [name: TabName]
  'tab-remove': [name: TabName]
  'tab-add': []
  edit: [name: TabName | undefined, action: 'remove' | 'add']
}>()
const panes = ref<TabPaneConfig[]>([])
const internalActive = ref<TabName>(props.modelValue)
watch(
  () => props.modelValue,
  (value) => {
    internalActive.value = value
  }
)
const activeName = computed(() => internalActive.value || panes.value[0]?.name)
const activePane = computed(() => panes.value.find((pane) => pane.name === activeName.value))
function register(pane: TabPaneConfig) {
  const index = panes.value.findIndex((entry) => entry.id === pane.id)
  index >= 0 ? panes.value.splice(index, 1, pane) : panes.value.push(pane)
}
function unregister(id: string) {
  panes.value = panes.value.filter((pane) => pane.id !== id)
}
provide(tabsContextKey, { register, unregister })
async function setActiveName(name: TabName) {
  if (name === activeName.value) return
  if (props.beforeLeave && (await props.beforeLeave(name, activeName.value)) === false) return
  internalActive.value = name
  emit('update:modelValue', name)
  emit('tab-change', name)
}
function select(pane: TabPaneConfig, event?: MouseEvent) {
  if (pane.disabled) return
  void setActiveName(pane.name)
  if (event) emit('tab-click', pane, event)
}
function remove(pane: TabPaneConfig) {
  emit('tab-remove', pane.name)
  emit('edit', pane.name, 'remove')
}
function add() {
  emit('tab-add')
  emit('edit', undefined, 'add')
}
defineExpose({ currentName: activeName, setActiveName })
</script>
<style scoped>
.mg-tabs {
  display: flex;
  flex-direction: column;
}
.mg-tabs__collector {
  display: none;
}
.mg-tabs__nav {
  display: flex;
  border-bottom: 1px solid var(--mg-color-border-light, #ebecef);
}
.mg-tabs__tab,
.mg-tabs__add {
  min-height: 40px;
  padding: 0 16px;
  color: var(--mg-color-text-regular, #424a57);
  font: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
}
.mg-tabs__tab.is-active {
  color: var(--mg-color-primary, #0052d9);
  border-bottom-color: currentColor;
}
.mg-tabs__tab:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.mg-tabs__close {
  margin-left: 8px;
}
.mg-tabs__content {
  padding-top: 16px;
}
.mg-tabs--card .mg-tabs__tab,
.mg-tabs--border-card .mg-tabs__tab {
  margin-bottom: -1px;
  border: 1px solid var(--mg-color-border-light, #ebecef);
  border-radius: 4px 4px 0 0;
}
.mg-tabs--border-card {
  border: 1px solid var(--mg-color-border-light, #ebecef);
}
.mg-tabs--border-card .mg-tabs__header {
  background: var(--mg-color-fill-light, #f5f6f7);
}
.mg-tabs--border-card .mg-tabs__content {
  padding: 16px;
}
.mg-tabs.is-stretch .mg-tabs__tab {
  flex: 1;
}
.mg-tabs.is-bottom {
  flex-direction: column-reverse;
}
.mg-tabs.is-left,
.mg-tabs.is-right {
  flex-direction: row;
}
.mg-tabs.is-right {
  flex-direction: row-reverse;
}
.mg-tabs.is-left .mg-tabs__nav,
.mg-tabs.is-right .mg-tabs__nav {
  flex-direction: column;
  border-bottom: 0;
}
.mg-tabs.is-left .mg-tabs__tab,
.mg-tabs.is-right .mg-tabs__tab {
  border-bottom: 0;
  border-right: 2px solid transparent;
}
.mg-tabs.is-left .mg-tabs__tab.is-active,
.mg-tabs.is-right .mg-tabs__tab.is-active {
  border-right-color: currentColor;
}
.mg-tabs__tab:not(:disabled):hover, .mg-tabs__add:hover { color: var(--mg-color-primary, #0052d9); background: var(--mg-color-fill-hover, #f2f3ff); }
.mg-tabs__tab:focus-visible, .mg-tabs__add:focus-visible { position: relative; z-index: 1; outline: none; box-shadow: inset var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-tabs__tab:not(:disabled):active, .mg-tabs__add:active { background: var(--mg-color-fill-active, #d9e1ff); }
.mg-tabs__tab.is-active:not(:disabled):hover { color: var(--mg-color-primary-hover, #618dff); }
</style>
