import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgTreeSelect } from '../index'

const data = [{ id: 1, label: '一级', children: [{ id: 2, label: '二级' }] }]
describe('MgTreeSelect', () => {
  it('expands and selects a tree node', async () => {
    const wrapper = mount(MgTreeSelect, { props: { modelValue: undefined, data } })
    await wrapper.find('.mg-tree-select__control').trigger('click'); await wrapper.find('.mg-tree-select__expand').trigger('click'); await wrapper.findAll('.mg-tree-select__label')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
  })
  it('supports multiple checked keys', async () => {
    const wrapper = mount(MgTreeSelect, { props: { modelValue: [], data, multiple: true, defaultExpandAll: true } })
    await wrapper.find('.mg-tree-select__control').trigger('click'); await wrapper.findAll('.mg-tree-select__label')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[2]])
  })
})
