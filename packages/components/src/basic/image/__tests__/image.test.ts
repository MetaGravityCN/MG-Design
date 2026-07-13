import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgImage } from '../index'

describe('MgImage', () => {
  it('renders native load and error states', async () => {
    const wrapper = mount(MgImage, { props: { src: '/photo.png', alt: '照片' }, slots: { error: '图片错误' } })
    const image = wrapper.find('img')
    await image.trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)
    await image.trigger('error')
    expect(wrapper.text()).toContain('图片错误')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('opens, switches and closes the preview viewer', async () => {
    const list = ['/one.png', '/two.png']
    const wrapper = mount(MgImage, { attachTo: document.body, props: { src: list[0], previewSrcList: list } })
    await wrapper.find('img').trigger('click')
    expect(document.body.querySelector('.mg-image-viewer')).not.toBeNull()
    const next = document.body.querySelector('.mg-image-viewer__next') as HTMLButtonElement
    next.click(); await wrapper.vm.$nextTick()
    expect(wrapper.emitted('switch')).toEqual([[1]])
    ;(document.body.querySelector('.mg-image-viewer__close') as HTMLButtonElement).click(); await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })
})
