import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MgRow } from '../index'
import { MgCol } from '../../col'

describe('MgRow and MgCol', () => {
  it('shares gutter spacing with columns', () => {
    const wrapper = mount(MgRow, { props: { gutter: 20 }, slots: { default: () => h(MgCol, { span: 8 }) } })
    expect(wrapper.attributes('style')).toContain('margin-left: -10px')
    expect(wrapper.find('.mg-col').attributes('style')).toContain('padding-left: 10px')
  })

  it('maps responsive props to MG variables', () => {
    const wrapper = mount(MgCol, { props: { span: 8, offset: 2, md: { span: 6, push: 1 } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('--mg-col-span: 8')
    expect(style).toContain('--mg-col-offset: 2')
    expect(style).toContain('--mg-col-md-span: 6')
  })
})
