import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgBadge } from '../index'

describe('MgBadge', () => {
  it('caps numeric content at max', () => {
    const wrapper = mount(MgBadge, { props: { value: 120, max: 99 } })
    expect(wrapper.get('.mg-badge__content').text()).toBe('99+')
  })

  it('supports dot, hidden and custom color states', () => {
    const dot = mount(MgBadge, { props: { isDot: true, color: '#123456' }, slots: { default: 'Inbox' } })
    expect(dot.get('.mg-badge__content').classes()).toContain('is-dot')
    expect(dot.get('.mg-badge__content').attributes('style')).toContain('background-color: rgb(18, 52, 86)')
    expect(mount(MgBadge, { props: { hidden: true } }).find('.mg-badge__content').exists()).toBe(false)
  })
})
