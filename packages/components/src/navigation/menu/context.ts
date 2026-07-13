import type { InjectionKey } from 'vue'
export interface MenuContext { active: () => string; opened: (index: string) => boolean; select: (index: string) => void; toggle: (index: string) => void; collapse: () => boolean }
export const menuContextKey: InjectionKey<MenuContext> = Symbol('mg-menu')
