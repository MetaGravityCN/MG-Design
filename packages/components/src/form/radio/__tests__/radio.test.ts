import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MgRadio, MgRadioGroup } from '../index'

describe('MgRadio', () => {
  it('selects one value inside a group', async () => {
    const Host = defineComponent({ components: { MgRadio, MgRadioGroup }, setup: () => ({ value: ref('A') }), template: '<MgRadioGroup v-model="value"><MgRadio label="A"/><MgRadio label="B"/></MgRadioGroup>' })
    const wrapper = mount(Host); await wrapper.findAll('input')[1].setValue(true)
    expect(wrapper.vm.value).toBe('B')
    expect(wrapper.findAll('.is-checked')).toHaveLength(1)
  })
})
