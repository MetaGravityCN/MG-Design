import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgDrawer } from '../index'

describe('MgDrawer', () => {
  afterEach(() => { document.body.style.cssText = ''; document.body.innerHTML = '' })

  it('renders direction and size without framework classes', () => {
    const wrapper = mount(MgDrawer, { attachTo: document.body, props: { modelValue: true, teleported: false, direction: 'ltr', size: 320 } })
    const drawer = wrapper.get('[role="dialog"]')
    expect(drawer.classes()).toContain('is-ltr')
    expect(drawer.attributes('style')).toContain('width: 320px')
    expect(drawer.element.tagName).toBe('SECTION')
    wrapper.unmount()
  })

  it('closes only when escape is enabled', () => {
    const wrapper = mount(MgDrawer, { props: { modelValue: true, teleported: false } })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
