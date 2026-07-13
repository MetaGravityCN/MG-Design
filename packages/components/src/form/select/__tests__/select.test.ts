import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgSelect } from '../index'
import { MgOption } from '../../option'

describe('MgSelect', () => {
  it('renders with the mg-select class', () => {
    const wrapper = mount(MgSelect)
    expect(wrapper.classes()).toContain('mg-select')
  })

  it('forwards placeholder attr', () => {
    const wrapper = mount(MgSelect, { attrs: { placeholder: '请选择' } })
    expect(wrapper.html()).toContain('请选择')
  })

  it('forwards disabled state', () => {
    const wrapper = mount(MgSelect, { attrs: { disabled: true } })
    expect(wrapper.html()).toContain('is-disabled')
  })

  it('selects registered options with keyboard-friendly listbox markup', async () => {
    const wrapper = mount(MgSelect, { props: { modelValue: undefined }, slots: { default: '<MgOption label="选项一" value="one" /><MgOption label="选项二" value="two" />' }, global: { components: { MgOption } } })
    await wrapper.find('.mg-select__control').trigger('click')
    await wrapper.findAll('.mg-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['two'])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('supports multiple values and clear', async () => {
    const wrapper = mount(MgSelect, { props: { modelValue: ['one'], multiple: true, clearable: true }, slots: { default: '<MgOption label="选项一" value="one" /><MgOption label="选项二" value="two" />' }, global: { components: { MgOption } } })
    await wrapper.find('.mg-select__control').trigger('click')
    await wrapper.findAll('.mg-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['one', 'two']])
    await wrapper.find('.mg-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })
})
