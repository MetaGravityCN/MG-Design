import type { InjectionKey } from 'vue'
export type CollapseName = string | number
export interface CollapseContext { isActive: (name: CollapseName) => boolean; toggle: (name: CollapseName) => void }
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('mg-collapse')
