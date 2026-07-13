import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgStatistic } from '../index'

describe('MgStatistic', () => {
  it('formats precision, grouping, and affixes', () => {
    const wrapper = mount(MgStatistic, { props: { value: 12345.6, precision: 2, prefix: '$', suffix: 'USD' } })
    expect(wrapper.get('.mg-statistic__number').text()).toBe('12,345.60')
    expect(wrapper.get('.mg-statistic__prefix').text()).toBe('$')
    expect(wrapper.get('.mg-statistic__suffix').text()).toBe('USD')
  })
})
