<template>
  <li
    class="mg-tree-node"
    role="treeitem"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-selected="current"
    :aria-disabled="disabled || undefined"
    @click="select"
    @keydown="handleKeydown"
  >
    <div :class="['mg-tree-node__content', { 'is-current': current, 'is-disabled': disabled }]">
      <button
        v-if="hasChildren"
        type="button"
        class="mg-tree-node__toggle"
        :aria-label="expanded ? '收起' : '展开'"
        @click.stop="context.toggleExpand(node)"
      >
        {{ expanded ? '▾' : '▸' }}
      </button>
      <span v-else class="mg-tree-node__toggle is-placeholder" />
      <input
        v-if="context.showCheckbox"
        type="checkbox"
        :checked="checked"
        :disabled="disabled"
        :aria-label="context.labelOf(node)"
        @click.stop
        @change="context.toggleCheck(node, ($event.target as HTMLInputElement).checked)"
      />
      <SlotRenderer v-if="render" :render="render" :scope="{ node, data: node }" />
      <span v-else class="mg-tree-node__label">{{ context.labelOf(node) }}</span>
    </div>
    <ul v-if="hasChildren && expanded" class="mg-tree-node__children" role="group">
      <TreeNode
        v-for="child in children"
        :key="context.keyOf(child)"
        :node="child"
        :render="render"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, defineComponent, inject, type Slot } from 'vue'
import { treeContextKey, type TreeNodeData } from './context'

defineOptions({ name: 'TreeNode' })
const props = defineProps<{ node: TreeNodeData; render?: Slot }>()
const injectedContext = inject(treeContextKey)
if (!injectedContext) throw new Error('TreeNode must be used inside MgTree')
const context = injectedContext

const SlotRenderer = defineComponent(
  (slotProps: { render?: Slot; scope?: Record<string, unknown> }) => () =>
    slotProps.render?.(slotProps.scope),
  { props: ['render', 'scope'] }
)
const children = computed(() => context.childrenOf(props.node))
const hasChildren = computed(() => children.value.length > 0)
const expanded = computed(() => context.expanded(props.node))
const checked = computed(() => context.checked(props.node))
const current = computed(() => context.current(props.node))
const disabled = computed(() => context.disabledOf(props.node))

function select() {
  if (disabled.value) return
  context.selectNode(props.node)
  if (context.expandOnClickNode && hasChildren.value) context.toggleExpand(props.node)
  if (context.checkOnClickNode && context.showCheckbox) context.toggleCheck(props.node)
}

function handleKeydown(event: KeyboardEvent) {
  if (disabled.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select()
    return
  }
  if (event.key === 'ArrowRight' && hasChildren.value && !expanded.value) {
    event.preventDefault()
    context.toggleExpand(props.node)
  } else if (event.key === 'ArrowLeft' && hasChildren.value && expanded.value) {
    event.preventDefault()
    context.toggleExpand(props.node)
  }
}
</script>

<style scoped>
.mg-tree-node,
.mg-tree-node__children {
  margin: 0;
  padding: 0;
  list-style: none;
}
.mg-tree-node {
  border-radius: var(--mg-border-radius-base, 3px);
  outline: none;
}
.mg-tree-node__children {
  padding-left: 20px;
}
.mg-tree-node__content {
  display: flex;
  align-items: center;
  min-height: 32px;
  gap: 6px;
  cursor: pointer;
  border-radius: inherit;
}
.mg-tree-node:not([aria-disabled='true']):hover > .mg-tree-node__content,
.mg-tree-node__content.is-current {
  background: var(--mg-color-fill-hover, #f2f3ff);
}
.mg-tree-node:focus-visible > .mg-tree-node__content {
  box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff);
}
.mg-tree-node:not([aria-disabled='true']):active > .mg-tree-node__content {
  background: var(--mg-color-fill-active, #d9e1ff);
}
.mg-tree-node__content.is-disabled {
  cursor: not-allowed;
  opacity: var(--mg-opacity-disabled, 0.55);
}
.mg-tree-node__toggle {
  width: 20px;
  padding: 0;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--mg-border-radius-small, 2px);
}
.mg-tree-node__toggle:focus-visible {
  outline: none;
  box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff);
}
.mg-tree-node__toggle.is-placeholder {
  display: inline-block;
}
</style>
