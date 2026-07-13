import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { MgBreadcrumb } from '../index'
import { MgBreadcrumbItem } from '../../breadcrumb-item'

describe('MgBreadcrumb', () => {
  it('provides separators and supports router links', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }] })
    await router.push('/'); await router.isReady()
    const wrapper = mount(MgBreadcrumb, {
      props: { separator: '>' },
      slots: { default: () => [h(MgBreadcrumbItem, { to: '/' }, { default: () => 'Home' }), h(MgBreadcrumbItem, null, { default: () => 'Current' })] },
      global: { plugins: [router] },
    })
    expect(wrapper.get('a').attributes('href')).toBe('/')
    expect(wrapper.findAll('.mg-breadcrumb-item__separator')[0].text()).toBe('>')
    expect(wrapper.attributes('aria-label')).toBe('面包屑导航')
  })
})
