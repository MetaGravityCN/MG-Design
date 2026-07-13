import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MgCheckbox, MgCheckboxGroup } from '../index'

describe('MgCheckbox', () => {
  it('emits configured standalone values', async () => {
    const wrapper = mount(MgCheckbox, { props: { modelValue: 'no', trueValue: 'yes', falseValue: 'no' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['yes'])
  })
  it('updates a group and enforces max', async () => {
    const Host = defineComponent({ components: { MgCheckbox, MgCheckboxGroup }, setup: () => ({ values: ref<string[]>([]) }), template: '<MgCheckboxGroup v-model="values" :max="1"><MgCheckbox label="A"/><MgCheckbox label="B"/></MgCheckboxGroup>' })
    const wrapper = mount(Host); const inputs = wrapper.findAll('input')
    await inputs[0].setValue(true); await inputs[1].setValue(true)
    expect(wrapper.vm.values).toEqual(['A'])
  })
  it('reflects indeterminate state on the native input', () => {
    const wrapper = mount(MgCheckbox, { props: { indeterminate: true } })
    expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)
  })
})
