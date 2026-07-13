import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { MgTooltip } from '../index'

describe('MgTooltip', () => {
  afterEach(() => { vi.useRealTimers(); document.body.innerHTML = '' })
  it('shows native tooltip content after hover', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MgTooltip, {
      attachTo: document.body,
      props: { content: 'Helpful text', teleported: false, showAfter: 0 },
      slots: { default: '<button>Info</button>' },
    })
    await wrapper.get('.mg-tooltip-trigger').trigger('mouseenter')
    vi.runAllTimers(); await nextTick()
    expect(wrapper.get('[role="tooltip"]').text()).toBe('Helpful text')
    expect(wrapper.get('[role="tooltip"]').classes()).toContain('mg-tooltip')
    wrapper.unmount()
  })
})
