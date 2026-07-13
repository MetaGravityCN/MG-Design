import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { MgDescriptions, MgDescriptionsItem } from '../src'

describe('MgDescriptions', () => {
  it('renders wrapped description items', async () => {
    const wrapper = mount({
      template: `
        <MgDescriptions :column="2" border>
          <MgDescriptionsItem label="授权编号">LIC-001</MgDescriptionsItem>
          <MgDescriptionsItem label="授权主体">示例企业</MgDescriptionsItem>
        </MgDescriptions>
      `,
    }, {
      global: { plugins: [MgDescriptions, MgDescriptionsItem] },
    })

    await nextTick()

    expect(wrapper.text()).toContain('授权编号')
    expect(wrapper.text()).toContain('LIC-001')
    expect(wrapper.text()).toContain('授权主体')
    expect(wrapper.text()).toContain('示例企业')
  })
})
