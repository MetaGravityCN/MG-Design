import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { MgLoading, vLoading } from '../index'
import { vLoading as rootLoadingDirective } from '../../../index'

describe('MgLoading', () => {
  afterEach(() => { vi.useRealTimers(); document.body.style.cssText = ''; document.body.innerHTML = '' })
  it('exports the directive from the package root', () => {
    expect(rootLoadingDirective).toBe(vLoading)
  })
  it('renders component and directive masks', async () => {
    const component = mount(MgLoading, { props: { loading: true, text: 'Loading' }, slots: { default: 'Content' } })
    expect(component.get('[role="status"]').text()).toContain('Loading')
    const directive = mount({
      data: () => ({ active: true }),
      template: '<div v-loading="active" mg-loading-text="Please wait">Area</div>',
    }, { global: { directives: { loading: vLoading } } })
    expect(directive.get('[role="status"]').text()).toContain('Please wait')
    await directive.setData({ active: false }); await nextTick()
    expect(directive.find('[role="status"]').exists()).toBe(false)
    component.unmount(); directive.unmount()
  })

  it('creates and closes fullscreen service masks', async () => {
    vi.useFakeTimers()
    const instance = MgLoading.service({ text: 'Working', lock: true })
    expect(instance.element.textContent).toContain('Working')
    expect(document.body.style.overflow).toBe('hidden')
    instance.close(); vi.runAllTimers(); await nextTick()
    expect(instance.element.isConnected).toBe(false)
    expect(document.body.style.overflow).toBe('')
  })
})
