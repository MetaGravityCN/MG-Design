import type { ComputedRef, InjectionKey } from 'vue'

export type SelectionValue = string | number | boolean | object

export interface CheckboxGroupContext {
  modelValue: ComputedRef<SelectionValue[]>
  disabled: ComputedRef<boolean>
  size: ComputedRef<string>
  min?: number
  max?: number
  toggle: (value: SelectionValue, checked: boolean) => void
}

export interface RadioGroupContext {
  modelValue: ComputedRef<SelectionValue | undefined>
  disabled: ComputedRef<boolean>
  size: ComputedRef<string>
  name?: string
  select: (value: SelectionValue) => void
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('mg-checkbox-group')
export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('mg-radio-group')
