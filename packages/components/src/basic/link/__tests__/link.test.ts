import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgLink } from '../index'

describe('MgLink', () => {
  it('renders href, target, type and content', () => {
    const wrapper = mount(MgLink, {
      props: { href: '/guide', target: '_blank', type: 'primary' },
      slots: { default: 'Guide' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/guide')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.classes()).toContain('mg-link--primary')
  })

  it('removes navigation and click emission while disabled', async () => {
    const wrapper = mount(MgLink, { props: { href: '/guide', disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
