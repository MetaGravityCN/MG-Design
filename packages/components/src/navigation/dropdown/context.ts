import type { InjectionKey } from 'vue'

export interface MgDropdownContext {
  select: (command: unknown, event: MouseEvent) => void
  close: () => void
}

export const mgDropdownKey: InjectionKey<MgDropdownContext> = Symbol('mg-dropdown')
