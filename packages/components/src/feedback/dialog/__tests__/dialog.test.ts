import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgDialog } from '../index'

describe('MgDialog', () => {
  afterEach(() => { document.body.style.cssText = ''; document.body.innerHTML = '' })

  it('renders an accessible native dialog and closes on escape', async () => {
    const wrapper = mount(MgDialog, {
      attachTo: document.body,
      props: { modelValue: true, teleported: false, title: 'Confirm' },
      slots: { default: '<button id="action">Action</button>' },
    })
    expect(wrapper.get('[role="dialog"]').classes()).toContain('mg-dialog')
    expect(wrapper.get('[role="dialog"]').element.tagName).toBe('DIV')
    expect(document.body.style.overflow).toBe('hidden')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('honors beforeClose and modal click behavior', async () => {
    const beforeClose = vi.fn((done: () => void) => done())
    const wrapper = mount(MgDialog, { props: { modelValue: true, teleported: false, beforeClose } })
    const overlay = wrapper.get('.mg-dialog-overlay')
    await overlay.trigger('pointerdown')
    await overlay.trigger('pointerup')
    expect(beforeClose).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
