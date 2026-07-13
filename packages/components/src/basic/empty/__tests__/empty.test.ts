import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgEmpty } from '../index'

describe('MgEmpty', () => {
  it('renders native illustration, description, and action content', () => {
    const wrapper = mount(MgEmpty, { props: { description: 'No data', imageSize: 90 }, slots: { default: '<button>Reload</button>' } })
    expect(wrapper.get('.mg-empty__description').text()).toBe('No data')
    expect(wrapper.get('.mg-empty__image').attributes('style')).toContain('width: 90px')
    expect(wrapper.get('button').text()).toBe('Reload')
  })
})
