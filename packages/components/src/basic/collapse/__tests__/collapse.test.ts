import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { MgCollapse } from '../index'
import { MgCollapseItem } from '../../collapse-item'

describe('MgCollapse', () => {
  it('expands multiple panels and updates v-model', async () => {
    const wrapper = mount({
      components: { MgCollapse, MgCollapseItem },
      setup: () => ({ active: ref<(string | number)[]>(['a']) }),
      template: `<MgCollapse v-model="active"><MgCollapseItem name="a" title="标题 A">内容 A</MgCollapseItem><MgCollapseItem name="b" title="标题 B">内容 B</MgCollapseItem></MgCollapse>`,
    })
    expect(wrapper.text()).toContain('内容 A')
    await wrapper.findAll('button')[1].trigger('click')
    expect((wrapper.vm as unknown as { active: string[] }).active).toEqual(['a', 'b'])
    expect(wrapper.findAll('.mg-collapse-item__content')[1].isVisible()).toBe(true)
  })

  it('keeps one panel active in accordion mode', async () => {
    const wrapper = mount({
      components: { MgCollapse, MgCollapseItem }, setup: () => ({ active: ref<string | number>('a') }),
      template: `<MgCollapse v-model="active" accordion><MgCollapseItem name="a" title="A">A 内容</MgCollapseItem><MgCollapseItem name="b" title="B">B 内容</MgCollapseItem></MgCollapse>`,
    })
    await wrapper.findAll('button')[1].trigger('click')
    expect((wrapper.vm as unknown as { active: string }).active).toBe('b')
    expect(wrapper.findAll('.mg-collapse-item__content')[0].isVisible()).toBe(false)
  })
})
