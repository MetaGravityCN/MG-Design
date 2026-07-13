import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MgAffix } from '../index'

describe('MgAffix', () => {
  it('emits fixed state changes from its measured position', async () => {
    const wrapper = mount(MgAffix, { props: { offsetTop: 20 }, slots: { default: '固定内容' } })
    const root = wrapper.find('.mg-affix').element as HTMLElement
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({ top: 10, bottom: 50, left: 0, right: 100, width: 100, height: 40, x: 0, y: 10, toJSON: () => ({}) })
    ;(wrapper.vm as unknown as { update: () => void }).update()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.mg-affix__content').classes()).toContain('is-fixed')
    expect(wrapper.emitted('change')).toContainEqual([true])
  })
})
