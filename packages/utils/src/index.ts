export const isString = (val: unknown): val is string => typeof val === 'string'

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === 'object'

export const isArray = Array.isArray

export const isFunction = (val: unknown): val is (...args: never[]) => unknown =>
  typeof val === 'function'

export const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true
  if (isString(val) || isArray(val)) return val.length === 0
  if (isObject(val)) return Object.keys(val).length === 0
  return false
}
