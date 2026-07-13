import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { MgInfiniteScroll } from '../index'

describe('MgInfiniteScroll', () => {
  it('loads when its component reaches the configured distance', async () => {
    const load = vi.fn()
    const wrapper = mount(MgInfiniteScroll, { props: { load, immediate: false, delay: 0, distance: 10 }, slots: { default: '内容' } })
    const root = wrapper.element as HTMLElement
    Object.defineProperties(root, { scrollHeight: { value: 200 }, clientHeight: { value: 100 }, scrollTop: { value: 95, writable: true } })
    await wrapper.trigger('scroll')
    expect(load).toHaveBeenCalledOnce()
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('installs and runs the infinite-scroll directive', async () => {
    vi.useFakeTimers()
    const load = vi.fn()
    const wrapper = mount({ setup: () => ({ load }), template: `<div v-infinite-scroll="load" infinite-scroll-immediate="false" infinite-scroll-delay="0" />` }, { global: { plugins: [MgInfiniteScroll] } })
    const root = wrapper.element as HTMLElement
    Object.defineProperties(root, { scrollHeight: { value: 100 }, clientHeight: { value: 100 }, scrollTop: { value: 0, writable: true } })
    await wrapper.trigger('scroll'); await vi.runAllTimersAsync()
    expect(load).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})
