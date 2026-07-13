import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgPagination } from '../index'

describe('MgPagination', () => {
  it('emits page changes from pager controls', async () => {
    const wrapper = mount(MgPagination, {
      props: { total: 100, pageSize: 10, currentPage: 1, layout: 'prev, pager, next' },
    })

    await wrapper.findAll('.mg-pagination__pager button')[1].trigger('click')
    expect(wrapper.emitted('update:currentPage')).toEqual([[2]])
    expect(wrapper.emitted('current-change')).toEqual([[2]])
    expect(wrapper.emitted('next-click')).toEqual([[2]])
  })

  it('emits page-size changes', async () => {
    const wrapper = mount(MgPagination, {
      props: { total: 100, pageSize: 10, layout: 'sizes' },
    })

    await wrapper.find('select').setValue('20')
    expect(wrapper.emitted('update:pageSize')).toEqual([[20]])
    expect(wrapper.emitted('size-change')).toEqual([[20]])
  })
})
