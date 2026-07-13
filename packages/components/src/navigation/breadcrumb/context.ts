import type { Component, InjectionKey } from 'vue'

export interface MgBreadcrumbContext { separator: string; separatorIcon?: string | Component }
export const mgBreadcrumbKey: InjectionKey<MgBreadcrumbContext> = Symbol('mg-breadcrumb')
