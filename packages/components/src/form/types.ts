import type { FormItemContext, FormItemProp } from '@mg-design/primitives'

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (rule: FormRule, value: unknown, callback: (error?: Error | string) => void) => unknown
}

export type FormRules = Record<string, FormRule | FormRule[]>

export interface FormInstance {
  validate: (callback?: (valid: boolean, fields?: unknown) => void) => Promise<boolean>
  validateField: (props?: FormItemProp | FormItemProp[], callback?: (valid: boolean) => void) => Promise<boolean>
  resetFields: (props?: FormItemProp | FormItemProp[]) => void
  clearValidate: (props?: FormItemProp | FormItemProp[]) => void
  scrollToField: (prop: FormItemProp) => void
  fields: FormItemContext[]
  getField: (prop: FormItemProp) => FormItemContext | undefined
}
