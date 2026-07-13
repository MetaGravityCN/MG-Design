import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgSwitch } from '../index'

describe('MgSwitch', () => {
  it('toggles custom active and inactive values', async () => {
    const wrapper = mount(MgSwitch, { props: { modelValue: 'off', activeValue: 'on', inactiveValue: 'off' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['on'])
  })
  it('honors beforeChange', async () => {
    const wrapper = mount(MgSwitch, { props: { modelValue: false, beforeChange: vi.fn(() => false) } })
    await wrapper.trigger('click'); await Promise.resolve()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
