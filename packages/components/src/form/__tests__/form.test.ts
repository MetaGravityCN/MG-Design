import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive } from 'vue'
import { MgForm } from '../form'
import { MgFormItem } from '../form-item'
import { MgInput } from '../input'

describe('MgForm', () => {
  it('renders with the mg-form class', () => {
    const wrapper = mount(MgForm)
    expect(wrapper.classes()).toContain('mg-form')
  })

  it('renders default slot content', () => {
    const wrapper = mount(MgForm, { slots: { default: '<div class="ff">字段</div>' } })
    expect(wrapper.html()).toContain('字段')
  })

  it('supports inline layout without legacy classes', () => {
    const wrapper = mount(MgForm, { props: { inline: true } })
    expect(wrapper.classes()).toContain('mg-form--inline')
    expect(wrapper.element.tagName).toBe('FORM')
  })

  it('validates and resets registered fields', async () => {
    const Host = defineComponent({
      components: { MgForm, MgFormItem, MgInput },
      setup() {
        const model = reactive({ name: '' })
        return { model }
      },
      template: '<MgForm ref="form" :model="model" :rules="{ name: [{ required: true, message: `请输入名称` }] }"><MgFormItem prop="name" label="名称"><MgInput v-model="model.name" /></MgFormItem></MgForm>',
    })
    const wrapper = mount(Host)
    const form = wrapper.findComponent(MgForm)
    expect(await form.vm.validate()).toBe(false)
    await nextTick()
    expect(wrapper.findComponent(MgFormItem).vm.validateMessage).toBe('请输入名称')
    expect(wrapper.text()).toContain('请输入名称')
    wrapper.vm.model.name = 'MG'
    await nextTick()
    expect(await form.vm.validate()).toBe(true)
    form.vm.resetFields()
    expect(wrapper.vm.model.name).toBe('')
  })
})
