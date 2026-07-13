import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgSlider } from '../index'

describe('MgSlider', () => {
  it('emits scalar input values', async () => {
    const wrapper = mount(MgSlider, { props: { modelValue: 20 } }); const input = wrapper.find('input[type="range"]')
    await input.setValue(35)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([35])
  })
  it('sorts range handles', async () => {
    const wrapper = mount(MgSlider, { props: { modelValue: [20, 70], range: true } }); const handles = wrapper.findAll('input[type="range"]')
    await handles[0].setValue(80)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[70, 80]])
  })
})
