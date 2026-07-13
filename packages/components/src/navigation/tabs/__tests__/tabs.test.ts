import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { MgTabs } from '../index'
import { MgTabPane } from '../../tab-pane'

describe('MgTabs', () => {
  it('registers panes and updates v-model', async () => {
    const wrapper = mount({
      components: { MgTabs, MgTabPane }, setup: () => ({ active: ref<string | number>('one') }),
      template: `<MgTabs v-model="active"><MgTabPane label="第一项" name="one">内容一</MgTabPane><MgTabPane label="第二项" name="two">内容二</MgTabPane></MgTabs>`,
    })
    await nextTick()
    expect(wrapper.text()).toContain('内容一')
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect((wrapper.vm as unknown as { active: string }).active).toBe('two')
    expect(wrapper.text()).toContain('内容二')
    expect(wrapper.findComponent(MgTabs).emitted('tab-click')).toHaveLength(1)
  })

  it('emits close events for closable panes', async () => {
    const wrapper = mount({ components: { MgTabs, MgTabPane }, template: `<MgTabs model-value="one" closable><MgTabPane label="第一项" name="one">内容</MgTabPane></MgTabs>` })
    await nextTick(); await wrapper.find('.mg-tabs__close').trigger('click')
    expect(wrapper.findComponent(MgTabs).emitted('tab-remove')).toEqual([['one']])
  })
})
