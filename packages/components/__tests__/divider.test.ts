import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MgDivider from '../src/basic/divider/divider.vue'

describe('MgDivider', () => {
  it('renders with the mg-divider class', () => {
    const wrapper = mount(MgDivider)
    expect(wrapper.classes()).toContain('mg-divider')
  })

  it('supports vertical semantic separators', () => {
    const wrapper = mount(MgDivider, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('mg-divider--vertical')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })
})
