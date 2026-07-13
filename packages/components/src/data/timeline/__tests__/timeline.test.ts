import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { MgTimeline } from '../index'
import { MgTimelineItem } from '../../timeline-item'

describe('MgTimeline', () => {
  it('renders timestamps and node states', () => {
    const wrapper = mount(MgTimeline, { slots: { default: () => h(MgTimelineItem, { timestamp: '2026-07-13', type: 'success', placement: 'top' }, { default: () => 'Released' }) } })
    expect(wrapper.get('.mg-timeline-item__timestamp').text()).toBe('2026-07-13')
    expect(wrapper.get('.mg-timeline-item__node').classes()).toContain('is-success')
    expect(wrapper.text()).toContain('Released')
  })
})
