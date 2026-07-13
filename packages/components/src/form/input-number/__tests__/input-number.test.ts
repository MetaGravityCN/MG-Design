import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgInputNumber } from '../index'

describe('MgInputNumber', () => {
  it('increments, clamps and emits a numeric model value', async () => {
    const wrapper = mount(MgInputNumber, { props: { modelValue: 2, min: 0, max: 3 } })
    await wrapper.find('.mg-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
    await wrapper.setProps({ modelValue: 3 })
    expect(wrapper.find('.mg-input-number__increase').attributes()).toHaveProperty('disabled')
  })

  it('supports precision and keyboard stepping', async () => {
    const wrapper = mount(MgInputNumber, { props: { modelValue: 1, step: 0.25, precision: 2 } })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.25])
  })

  it('renders only native MG markup', () => {
    const wrapper = mount(MgInputNumber, { props: { modelValue: 1 } })
    expect(wrapper.classes()).toContain('mg-input-number')
    expect(wrapper.find('input[role="spinbutton"]').exists()).toBe(true)
  })
})
