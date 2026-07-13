import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgInput } from '../index'

describe('MgInput', () => {
  it('renders with the mg-input class', () => {
    const wrapper = mount(MgInput)
    expect(wrapper.classes()).toContain('mg-input')
  })

  it('forwards placeholder attr to the underlying input', () => {
    const wrapper = mount(MgInput, { attrs: { placeholder: '请输入' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })

  it('supports textarea type via attr forwarding', () => {
    const wrapper = mount(MgInput, { attrs: { type: 'textarea' } })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('reflects disabled state', () => {
    const wrapper = mount(MgInput, { attrs: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
