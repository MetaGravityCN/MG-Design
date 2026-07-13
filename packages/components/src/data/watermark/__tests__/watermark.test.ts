import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgWatermark } from '../index'

describe('MgWatermark', () => {
  it('renders content below an independent SVG watermark layer', () => {
    const wrapper = mount(MgWatermark, {
      props: { content: 'CONFIDENTIAL', width: 200, rotate: -15 },
      slots: { default: '<article>业务内容</article>' },
    })
    expect(wrapper.text()).toContain('业务内容')
    const layer = wrapper.find('.mg-watermark__layer')
    expect(layer.attributes('style')).toContain('data:image/svg+xml')
    expect(layer.attributes('style')).toContain('300px')
  })
})
