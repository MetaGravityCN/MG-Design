import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { MgPopover } from '../index'

describe('MgPopover', () => {
  afterEach(() => { vi.useRealTimers(); document.body.innerHTML = '' })
  it('supports click visibility and rich slots', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MgPopover, {
      props: { title: 'Profile', teleported: false },
      slots: { reference: '<button>Open</button>', default: '<strong>Admin</strong>' },
    })
    await wrapper.get('.mg-popover-trigger').trigger('click')
    vi.runAllTimers(); await nextTick()
    expect(wrapper.get('[role="dialog"]').text()).toContain('Profile')
    expect(wrapper.get('[role="dialog"]').text()).toContain('Admin')
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])
    wrapper.unmount()
  })
})
