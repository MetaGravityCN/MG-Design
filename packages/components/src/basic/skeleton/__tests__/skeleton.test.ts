import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { MgSkeleton } from '../index'

describe('MgSkeleton', () => {
  afterEach(() => vi.useRealTimers())
  it('renders requested rows then reveals content', async () => {
    const wrapper = mount(MgSkeleton, { props: { rows: 2, loading: true, animated: true }, slots: { default: 'Loaded' } })
    expect(wrapper.findAll('.mg-skeleton-item')).toHaveLength(3)
    expect(wrapper.get('.mg-skeleton').classes()).toContain('is-animated')
    await wrapper.setProps({ loading: false })
    expect(wrapper.text()).toBe('Loaded')
  })
  it('honors loading throttle', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MgSkeleton, { props: { loading: false, throttle: 100 }, slots: { default: 'Ready' } })
    await wrapper.setProps({ loading: true })
    expect(wrapper.text()).toBe('Ready')
    vi.advanceTimersByTime(100); await nextTick()
    expect(wrapper.find('.mg-skeleton').exists()).toBe(true)
  })
})
