import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgTree } from '../index'

const data = [{ id: 1, label: '父节点', children: [{ id: 11, label: '子节点' }] }]

describe('MgTree', () => {
  it('renders recursively and exposes checked keys', async () => {
    const wrapper = mount(MgTree, { props: { data, nodeKey: 'id', showCheckbox: true, defaultExpandAll: true } })
    expect(wrapper.text()).toContain('父节点')
    expect(wrapper.text()).toContain('子节点')

    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect((wrapper.vm as unknown as { getCheckedKeys: () => number[] }).getCheckedKeys()).toEqual([1, 11])
    expect(wrapper.emitted('check-change')?.[0]).toEqual([data[0], true])
  })

  it('supports scoped content and node expansion', async () => {
    const wrapper = mount(MgTree, {
      props: { data, nodeKey: 'id' },
      slots: { default: '<template #default="{ data }"><strong>{{ data.label }}</strong></template>' },
    })
    expect(wrapper.findAll('strong')).toHaveLength(1)
    await wrapper.find('.mg-tree-node__content').trigger('click')
    expect(wrapper.findAll('strong')).toHaveLength(2)
    expect(wrapper.emitted('node-expand')).toBeTruthy()
  })

  it('supports keyboard selection and expansion', async () => {
    const wrapper = mount(MgTree, { props: { data, nodeKey: 'id' } })
    const rootNode = wrapper.get('[role="treeitem"]')
    expect(rootNode.attributes('tabindex')).toBe('0')

    await rootNode.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(2)
    expect(wrapper.emitted('node-expand')).toBeTruthy()

    await rootNode.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('node-click')?.at(-1)).toEqual([data[0]])
    expect(rootNode.attributes('aria-selected')).toBe('true')

    await rootNode.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(1)
  })

  it('removes disabled nodes from the tab order', () => {
    const wrapper = mount(MgTree, {
      props: { data: [{ id: 1, label: 'Disabled', disabled: true }], nodeKey: 'id' },
    })
    const node = wrapper.get('[role="treeitem"]')
    expect(node.attributes('tabindex')).toBe('-1')
    expect(node.attributes('aria-disabled')).toBe('true')
  })
})
