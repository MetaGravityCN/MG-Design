<template>
  <div v-bind="$attrs" :class="['mg-tree', { 'is-highlight-current': highlightCurrent }]">
    <ul v-if="visibleData.length" class="mg-tree__root" role="tree">
      <TreeNode
        v-for="node in visibleData"
        :key="keyOf(node)"
        :node="node"
        :render="slots.default"
      />
    </ul>
    <div v-else class="mg-tree__empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch, type Slot } from 'vue'
import TreeNode from './tree-node.vue'
import { treeContextKey, type TreeKey, type TreeNodeData, type TreePropsMap } from './context'

defineOptions({ name: 'MgTree', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    data?: TreeNodeData[]
    props?: TreePropsMap
    nodeKey?: string
    emptyText?: string
    showCheckbox?: boolean
    defaultExpandAll?: boolean
    defaultExpandedKeys?: TreeKey[]
    defaultCheckedKeys?: TreeKey[]
    currentNodeKey?: TreeKey
    highlightCurrent?: boolean
    expandOnClickNode?: boolean
    checkOnClickNode?: boolean
    filterNodeMethod?: (query: string, node: TreeNodeData) => boolean
  }>(),
  {
    data: () => [],
    props: () => ({}),
    emptyText: '暂无数据',
    expandOnClickNode: true,
    checkOnClickNode: false,
  }
)
const emit = defineEmits<{
  'node-click': [node: TreeNodeData]
  'node-expand': [node: TreeNodeData]
  'node-collapse': [node: TreeNodeData]
  'check-change': [node: TreeNodeData, checked: boolean]
  check: [node: TreeNodeData, state: { checkedNodes: TreeNodeData[]; checkedKeys: TreeKey[] }]
  'current-change': [node: TreeNodeData]
}>()
const slots = defineSlots<{ default?: Slot; empty?: Slot }>()

const childrenField = computed(() => props.props.children || 'children')
const labelField = computed(() => props.props.label || 'label')
const disabledField = computed(() => props.props.disabled || 'disabled')
const childrenOf = (node: TreeNodeData) =>
  (node[childrenField.value] as TreeNodeData[] | undefined) || []
const labelOf = (node: TreeNodeData) => String(node[labelField.value] ?? '')
const keyOf = (node: TreeNodeData): TreeKey =>
  (node[props.nodeKey || 'id'] as TreeKey | undefined) ?? labelOf(node)
const disabledOf = (node: TreeNodeData) => Boolean(node[disabledField.value])
const allNodes = computed(() => {
  const result: TreeNodeData[] = []
  const visit = (nodes: TreeNodeData[]) =>
    nodes.forEach((node) => {
      result.push(node)
      visit(childrenOf(node))
    })
  visit(props.data)
  return result
})
const expandedKeys = ref(new Set<TreeKey>())
const checkedKeys = ref(new Set<TreeKey>(props.defaultCheckedKeys))
const currentKey = ref<TreeKey | undefined>(props.currentNodeKey)
const query = ref('')

function initializeExpanded() {
  expandedKeys.value = new Set(
    props.defaultExpandAll ? allNodes.value.map(keyOf) : props.defaultExpandedKeys
  )
}
watch(
  () => [props.data, props.defaultExpandAll, props.defaultExpandedKeys] as const,
  initializeExpanded,
  { immediate: true, deep: true }
)
watch(
  () => props.defaultCheckedKeys,
  (keys) => {
    checkedKeys.value = new Set(keys)
  },
  { deep: true }
)
watch(
  () => props.currentNodeKey,
  (key) => {
    currentKey.value = key
  }
)

const visibleData = computed(() => {
  if (!query.value || !props.filterNodeMethod) return props.data
  const filter = (nodes: TreeNodeData[]): TreeNodeData[] =>
    nodes.flatMap((node) => {
      const children = filter(childrenOf(node))
      if (!props.filterNodeMethod!(query.value, node) && !children.length) return []
      return [{ ...node, [childrenField.value]: children }]
    })
  return filter(props.data)
})
const checkedNodes = () => allNodes.value.filter((node) => checkedKeys.value.has(keyOf(node)))
function descendants(node: TreeNodeData): TreeNodeData[] {
  return childrenOf(node).flatMap((child) => [child, ...descendants(child)])
}
function toggleExpand(node: TreeNodeData) {
  const key = keyOf(node)
  const next = new Set(expandedKeys.value)
  const opening = !next.has(key)
  opening ? next.add(key) : next.delete(key)
  expandedKeys.value = next
  if (opening) emit('node-expand', node)
  else emit('node-collapse', node)
}
function toggleCheck(node: TreeNodeData, value = !checkedKeys.value.has(keyOf(node))) {
  const next = new Set(checkedKeys.value)
  for (const item of [node, ...descendants(node)])
    if (!disabledOf(item)) value ? next.add(keyOf(item)) : next.delete(keyOf(item))
  checkedKeys.value = next
  emit('check-change', node, value)
  emit('check', node, { checkedNodes: checkedNodes(), checkedKeys: [...checkedKeys.value] })
}
function selectNode(node: TreeNodeData) {
  currentKey.value = keyOf(node)
  emit('node-click', node)
  emit('current-change', node)
}
function setCheckedKeys(keys: TreeKey[]) {
  checkedKeys.value = new Set(keys)
}
function setChecked(key: TreeKey | TreeNodeData, checked: boolean) {
  const node = typeof key === 'object' ? key : allNodes.value.find((item) => keyOf(item) === key)
  if (node) toggleCheck(node, checked)
}
function setCurrentKey(key?: TreeKey) {
  currentKey.value = key
}
function filter(value: string) {
  query.value = value
  if (value) expandedKeys.value = new Set(allNodes.value.map(keyOf))
}

provide(treeContextKey, {
  childrenOf,
  labelOf,
  keyOf,
  disabledOf,
  expanded: (node) => expandedKeys.value.has(keyOf(node)),
  checked: (node) => checkedKeys.value.has(keyOf(node)),
  current: (node) => currentKey.value === keyOf(node),
  showCheckbox: props.showCheckbox,
  expandOnClickNode: props.expandOnClickNode,
  checkOnClickNode: props.checkOnClickNode,
  toggleExpand,
  toggleCheck,
  selectNode,
})
defineExpose({
  getCheckedNodes: checkedNodes,
  getCheckedKeys: () => [...checkedKeys.value],
  setCheckedKeys,
  setChecked,
  getCurrentNode: () => allNodes.value.find((node) => keyOf(node) === currentKey.value),
  getCurrentKey: () => currentKey.value,
  setCurrentKey,
  getNode: (key: TreeKey) => allNodes.value.find((node) => keyOf(node) === key),
  filter,
})
</script>

<style scoped>
.mg-tree {
  color: var(--mg-color-text-regular, #424a57);
  font-size: 14px;
}
.mg-tree__root {
  margin: 0;
  padding: 0;
  list-style: none;
}
.mg-tree__empty {
  padding: 24px;
  text-align: center;
  color: var(--mg-color-text-placeholder, #a1a7b3);
}
</style>
