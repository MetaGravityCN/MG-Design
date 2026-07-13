import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgButton } from '../index'

describe('MgButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(MgButton, { slots: { default: '确认' } })
    expect(wrapper.text()).toContain('确认')
  })

  it('applies the mg-button class', () => {
    const wrapper = mount(MgButton)
    expect(wrapper.classes()).toContain('mg-button')
  })

  it('applies the public type variant without framework classes', () => {
    const wrapper = mount(MgButton, { attrs: { type: 'primary' } })
    expect(wrapper.classes()).toContain('mg-button--primary')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('supports disabled state', () => {
    const wrapper = mount(MgButton, { attrs: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it.each(['primary', 'success', 'warning', 'danger', 'info'] as const)(
    'applies the %s semantic state class',
    (type) => {
      const wrapper = mount(MgButton, { props: { type } })
      expect(wrapper.classes()).toContain(`mg-button--${type}`)
      expect(wrapper.classes()).not.toContain('is-disabled')
    },
  )

  it('exposes disabled semantics for non-button tags', () => {
    const wrapper = mount(MgButton, { props: { tag: 'a', disabled: true } })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('emits click event', async () => {
    const wrapper = mount(MgButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('blocks clicks while loading', async () => {
    const wrapper = mount(MgButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })
})
