import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgIcon } from '../index'

describe('MgIcon', () => {
  it('renders a named MG icon with size and color', () => {
    const wrapper = mount(MgIcon, { props: { name: 'Search', size: 20, color: '#0052d9' } })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('font-size: 20px')
    expect(wrapper.attributes('style')).toContain('color: rgb(0, 82, 217)')
  })

  it('prefers the default slot and exposes accessible labels', () => {
    const wrapper = mount(MgIcon, { props: { name: 'Search', label: 'Search' }, slots: { default: '<svg data-test="custom" />' } })
    expect(wrapper.find('[data-test="custom"]').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Search')
  })
})
