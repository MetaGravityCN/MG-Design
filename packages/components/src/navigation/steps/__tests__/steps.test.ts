import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { MgSteps } from '../index'
import { MgStep } from '../../step'

describe('MgSteps', () => {
  it('derives step statuses and reacts to active changes', async () => {
    const wrapper = mount(MgSteps, {
      props: { active: 1, finishStatus: 'success', space: 120 },
      slots: { default: () => ['One', 'Two', 'Three'].map((title) => h(MgStep, { title })) },
    })
    await nextTick()
    const steps = wrapper.findAll('.mg-step')
    expect(steps[0].classes()).toContain('is-success')
    expect(steps[1].classes()).toContain('is-process')
    expect(steps[2].classes()).toContain('is-wait')
    expect(steps[0].attributes('style')).toContain('120px')
    await wrapper.setProps({ active: 2 })
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 1])
  })
})
