import type { ComputedRef, InjectionKey } from 'vue'
import type { SelectionValue } from './selection-context'

export interface SelectOptionRecord { value: SelectionValue; label: string; disabled: boolean; id: string }
export interface SelectContext {
  selected: (value: SelectionValue) => boolean
  select: (option: SelectOptionRecord) => void
  register: (option: SelectOptionRecord) => void
  unregister: (id: string) => void
  visible: (option: SelectOptionRecord) => boolean
  highlightedId: ComputedRef<string | undefined>
}
export const selectContextKey: InjectionKey<SelectContext> = Symbol('mg-select')
