import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MgBacktop } from '../index'

describe('MgBacktop', () => {
  it('appears after the threshold and scrolls its target to top', async () => {
    const target = document.createElement('div')
    target.scrollTop = 300
    target.scrollTo = vi.fn()
    const wrapper = mount(MgBacktop, { props: { target, visibilityHeight: 200, behavior: 'auto' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.mg-backtop').exists()).toBe(true)
    await wrapper.find('.mg-backtop').trigger('click')
    expect(target.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
