import type { InjectionKey } from 'vue'

export type TreeKey = string | number
export type TreeNodeData = Record<string, unknown>

export interface TreePropsMap {
  children?: string
  label?: string
  disabled?: string
}

export interface TreeContext {
  childrenOf: (node: TreeNodeData) => TreeNodeData[]
  labelOf: (node: TreeNodeData) => string
  keyOf: (node: TreeNodeData) => TreeKey
  disabledOf: (node: TreeNodeData) => boolean
  expanded: (node: TreeNodeData) => boolean
  checked: (node: TreeNodeData) => boolean
  current: (node: TreeNodeData) => boolean
  showCheckbox: boolean
  expandOnClickNode: boolean
  checkOnClickNode: boolean
  toggleExpand: (node: TreeNodeData) => void
  toggleCheck: (node: TreeNodeData, checked?: boolean) => void
  selectNode: (node: TreeNodeData) => void
}

export const treeContextKey: InjectionKey<TreeContext> = Symbol('mg-tree')
