import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgCascader } from '../index'

const options = [{ value: 'guide', label: '指南', children: [{ value: 'design', label: '设计原则' }] }]
describe('MgCascader', () => {
  it('expands and selects a leaf path', async () => {
    const wrapper = mount(MgCascader, { props: { modelValue: [], options } })
    await wrapper.find('.mg-cascader__control').trigger('click'); await wrapper.find('.mg-cascader__option').trigger('click'); await wrapper.findAll('.mg-cascader__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['guide', 'design']])
  })
  it('emits a scalar when emitPath is disabled', async () => {
    const wrapper = mount(MgCascader, { props: { modelValue: [], options, props: { emitPath: false } } })
    await wrapper.find('.mg-cascader__control').trigger('click'); await wrapper.find('.mg-cascader__option').trigger('click'); await wrapper.findAll('.mg-cascader__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['design'])
  })
})
