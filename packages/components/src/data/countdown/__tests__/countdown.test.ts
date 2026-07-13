import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MgCountdown } from '../index'

afterEach(() => vi.useRealTimers())

describe('MgCountdown', () => {
  it('formats remaining time and emits finish', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-13T00:00:00Z'))
    const wrapper = mount(MgCountdown, { props: { value: Date.now() + 2000, format: 'HH:mm:ss' } })
    expect(wrapper.text()).toContain('00:00:02')

    await vi.advanceTimersByTimeAsync(2250)
    expect(wrapper.text()).toContain('00:00:00')
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })
})
