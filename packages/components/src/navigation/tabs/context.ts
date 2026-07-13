import type { InjectionKey, Slot } from 'vue'
export type TabName = string | number
export interface TabPaneConfig { id: string; name: TabName; label?: string; disabled?: boolean; closable?: boolean; lazy?: boolean; slots: { default?: Slot; label?: Slot } }
export interface TabsContext { register: (pane: TabPaneConfig) => void; unregister: (id: string) => void }
export const tabsContextKey: InjectionKey<TabsContext> = Symbol('mg-tabs')
