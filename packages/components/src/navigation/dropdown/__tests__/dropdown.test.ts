import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { MgDropdown } from '../index'
import { MgDropdownMenu } from '../../dropdown-menu'
import { MgDropdownItem } from '../../dropdown-item'

describe('MgDropdown', () => {
  afterEach(() => { vi.useRealTimers(); document.body.innerHTML = '' })
  it('emits item commands and hides after selection', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MgDropdown, {
      props: { trigger: 'click', teleported: false, showTimeout: 0 },
      slots: {
        default: '<button>Actions</button>',
        dropdown: () => h(MgDropdownMenu, null, { default: () => h(MgDropdownItem, { command: 'edit' }, { default: () => 'Edit' }) }),
      },
    })
    await wrapper.get('.mg-dropdown').trigger('click')
    vi.runAllTimers(); await nextTick()
    expect(wrapper.get('[role="menu"]')).toBeTruthy()
    await wrapper.get('[role="menuitem"]').trigger('click')
    vi.runAllTimers(); await nextTick()
    expect(wrapper.emitted('command')?.[0]?.[0]).toBe('edit')
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
