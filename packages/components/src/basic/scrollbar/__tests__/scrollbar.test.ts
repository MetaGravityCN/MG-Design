import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgScrollbar } from '../index'

describe('MgScrollbar', () => {
  it('renders a native scroll container and exposes positioning methods', async () => {
    const wrapper = mount(MgScrollbar, { props: { height: 120, tag: 'section' }, slots: { default: '<div style="height:400px">内容</div>' } })
    const component = wrapper.vm as unknown as { setScrollTop: (value: number) => void; setScrollLeft: (value: number) => void }
    component.setScrollTop(80); component.setScrollLeft(20)
    const wrap = wrapper.find('.mg-scrollbar__wrap')
    await wrap.trigger('scroll')
    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.emitted('scroll')).toEqual([[{ scrollTop: 80, scrollLeft: 20 }]])
  })
})
