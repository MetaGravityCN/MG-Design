import { describe, expect, it, vi } from 'vitest'
import { createFormFieldRegistry, getValueAtPath, normalizeFormPath, setValueAtPath, type FormItemContext } from '../src'

describe('form primitives', () => {
  it('reads and writes nested model paths', () => {
    const model: Record<string, unknown> = { users: [{ name: 'A' }] }
    expect(normalizeFormPath('users[0].name')).toEqual(['users', 0, 'name'])
    expect(getValueAtPath(model, 'users[0].name')).toBe('A')
    setValueAtPath(model, 'users[0].name', 'B')
    expect(getValueAtPath(model, ['users', 0, 'name'])).toBe('B')
  })

  it('registers, locates, validates and removes fields', async () => {
    const registry = createFormFieldRegistry()
    const validate = vi.fn(async () => true)
    const field: FormItemContext = { prop: 'name', validate, resetField: vi.fn(), clearValidate: vi.fn() }
    registry.addField(field)
    expect(registry.getField('name')).toBe(field)
    expect(await registry.validateField('name')).toBe(true)
    expect(validate).toHaveBeenCalledOnce()
    registry.removeField(field)
    expect(registry.fields).toHaveLength(0)
  })
})
