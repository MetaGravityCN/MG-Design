import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgProgress } from '../index'

describe('MgProgress', () => {
  it('renders accessible line progress with resolved color', () => {
    const wrapper = mount(MgProgress, { props: { percentage: 60, color: [{ color: 'red', percentage: 30 }, { color: 'green', percentage: 100 }] } })
    expect(wrapper.attributes('aria-valuenow')).toBe('60')
    expect(wrapper.get('.mg-progress__fill').attributes('style')).toContain('width: 60%')
    expect(wrapper.get('.mg-progress__fill').attributes('style')).toContain('green')
  })
  it('renders circle and dashboard SVG modes', () => {
    const circle = mount(MgProgress, { props: { type: 'circle', percentage: 75 } })
    expect(circle.findAll('circle')).toHaveLength(2)
    expect(circle.get('.mg-progress__circle-text').text()).toBe('75%')
    const dashboard = mount(MgProgress, { props: { type: 'dashboard', percentage: 50 } })
    expect(dashboard.get('.mg-progress').classes()).toContain('is-dashboard')
  })
})
