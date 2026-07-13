import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgResult } from '../index'

describe('MgResult', () => {
  it('renders status and content slots', () => {
    const wrapper = mount(MgResult, {
      props: { icon: 'success', title: 'Saved', subTitle: 'All changes stored' },
      slots: { extra: '<button>Continue</button>' },
    })
    expect(wrapper.classes()).toContain('is-success')
    expect(wrapper.get('.mg-result__title').text()).toBe('Saved')
    expect(wrapper.get('button').text()).toBe('Continue')
  })
})
