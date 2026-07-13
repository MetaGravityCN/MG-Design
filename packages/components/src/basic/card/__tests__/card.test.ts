import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgCard } from '../index'

describe('MgCard', () => {
  it('renders header, body, footer and shadow state', () => {
    const wrapper = mount(MgCard, { props: { header: 'Title', shadow: 'hover' }, slots: { default: 'Body', footer: 'Footer' } })
    expect(wrapper.classes()).toContain('is-hover-shadow')
    expect(wrapper.find('.mg-card__header').text()).toBe('Title')
    expect(wrapper.find('.mg-card__body').text()).toBe('Body')
    expect(wrapper.find('.mg-card__footer').text()).toBe('Footer')
  })
})
