import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { MgPopconfirm } from '../index'

describe('MgPopconfirm', () => {
  afterEach(() => { vi.useRealTimers(); document.body.innerHTML = '' })
  it('emits confirm and closes', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MgPopconfirm, {
      props: { title: 'Delete?', teleported: false },
      slots: { reference: '<button>Delete</button>' },
    })
    await wrapper.get('.mg-popover-trigger').trigger('click')
    vi.runAllTimers(); await nextTick()
    expect(wrapper.get('[role="alertdialog"]').text()).toContain('Delete?')
    await wrapper.findAll('.mg-popconfirm__button')[1].trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})
