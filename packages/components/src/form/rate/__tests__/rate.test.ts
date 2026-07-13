import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgRate } from '../index'

describe('MgRate', () => {
  it('selects a score and exposes radio semantics', async () => {
    const wrapper = mount(MgRate, { props: { modelValue: 0 } }); await wrapper.findAll('button')[2].trigger('click', { clientX: 20 })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })
  it('supports half scores', async () => {
    const wrapper = mount(MgRate, { props: { modelValue: 0, allowHalf: true } }); const button = wrapper.findAll('button')[1]
    Object.defineProperty(button.element, 'getBoundingClientRect', { value: () => ({ left: 0, width: 24 }) })
    await button.trigger('click', { clientX: 2 })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.5])
  })
})
