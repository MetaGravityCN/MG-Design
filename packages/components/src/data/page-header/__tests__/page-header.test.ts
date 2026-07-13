import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgPageHeader } from '../index'

describe('MgPageHeader', () => {
  it('renders title and content props and emits back', async () => {
    const wrapper = mount(MgPageHeader, { props: { title: '返回上级', content: '订单详情' } })
    expect(wrapper.text()).toContain('返回上级')
    expect(wrapper.text()).toContain('订单详情')
    await wrapper.get('.mg-page-header__back').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('supports content and extra slots and can hide the back control', () => {
    const wrapper = mount(MgPageHeader, {
      props: { title: '订单详情', icon: '' },
      slots: { content: '<strong>20260712001</strong>', extra: '<button>编辑</button>' },
    })
    expect(wrapper.find('.mg-page-header__back').exists()).toBe(false)
    expect(wrapper.get('.mg-page-header__content').text()).toBe('20260712001')
    expect(wrapper.get('.mg-page-header__extra').text()).toBe('编辑')
  })
})
