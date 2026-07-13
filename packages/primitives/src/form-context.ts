import { readonly, shallowReactive, type InjectionKey, type Ref } from 'vue'

export type FormItemProp = string | ReadonlyArray<string | number>
export type FormValidateState = '' | 'validating' | 'success' | 'error'
export type FormValidateTrigger = 'blur' | 'change' | string

export interface FormItemContext {
  prop: FormItemProp
  validate: (trigger?: FormValidateTrigger) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
  focus?: () => void
  readonly validateState?: FormValidateState
}

export interface FormContext {
  model?: Record<string, unknown>
  rules?: Readonly<Ref<Record<string, unknown> | undefined>>
  disabled?: Readonly<Ref<boolean | undefined>>
  labelPosition?: Readonly<Ref<'left' | 'right' | 'top'>>
  labelWidth?: Readonly<Ref<string | number | undefined>>
  hideRequiredAsterisk?: Readonly<Ref<boolean | undefined>>
  requireAsteriskPosition?: Readonly<Ref<'left' | 'right'>>
  showMessage?: Readonly<Ref<boolean>>
  inlineMessage?: Readonly<Ref<boolean | undefined>>
  statusIcon?: Readonly<Ref<boolean | undefined>>
  emitValidate?: (prop: FormItemProp, valid: boolean, message: string) => void
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  getField: (prop: FormItemProp) => FormItemContext | undefined
  validateField: (props?: FormItemProp | FormItemProp[]) => Promise<boolean>
  fields: readonly FormItemContext[]
}

export const formContextKey: InjectionKey<FormContext> = Symbol('mg-form-context')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('mg-form-item-context')

export function normalizeFormPath(path: FormItemProp): Array<string | number> {
  if (typeof path !== 'string') return [...path]
  return path.replace(/\[(\d+|[^\]]+)\]/g, '.$1').split('.').filter(Boolean).map((part) => /^\d+$/.test(part) ? Number(part) : part)
}

export function getValueAtPath(source: unknown, path: FormItemProp): unknown {
  return normalizeFormPath(path).reduce<unknown>((value, key) =>
    value != null && typeof value === 'object' ? (value as Record<string | number, unknown>)[key] : undefined,
  source)
}

export function setValueAtPath(source: Record<string | number, unknown>, path: FormItemProp, value: unknown) {
  const segments = normalizeFormPath(path)
  if (segments.length === 0) return
  let current = source
  segments.slice(0, -1).forEach((key, index) => {
    const existing = current[key]
    if (existing == null || typeof existing !== 'object') current[key] = typeof segments[index + 1] === 'number' ? [] : {}
    current = current[key] as Record<string | number, unknown>
  })
  current[segments.at(-1) as string | number] = value
}

export function createFormFieldRegistry() {
  const fields = shallowReactive<FormItemContext[]>([])
  const pathKey = (path: FormItemProp) => normalizeFormPath(path).join('.')
  const addField = (field: FormItemContext) => { if (!fields.includes(field)) fields.push(field) }
  const removeField = (field: FormItemContext) => {
    const index = fields.indexOf(field)
    if (index >= 0) fields.splice(index, 1)
  }
  const getField = (prop: FormItemProp) => fields.find((field) => pathKey(field.prop) === pathKey(prop))
  async function validateField(props?: FormItemProp | FormItemProp[]) {
    const requested = props === undefined ? fields : fields.filter((field) => {
      const candidates = Array.isArray(props) && (props.length === 0 || typeof props[0] !== 'number') ? props : [props]
      return (candidates as FormItemProp[]).some((prop) => pathKey(prop) === pathKey(field.prop))
    })
    const results = await Promise.all(requested.map((field) => field.validate()))
    return results.every(Boolean)
  }
  return { fields: readonly(fields), addField, removeField, getField, validateField }
}
