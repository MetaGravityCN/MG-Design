import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgTag } from '../index'

describe('MgTag', () => {
  it('applies type, size and effect states', () => {
    const wrapper = mount(MgTag, { props: { type: 'success', size: 'small', effect: 'dark' }, slots: { default: 'Ready' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['mg-tag--success', 'mg-tag--small', 'is-dark']))
  })

  it('emits close without also emitting click', async () => {
    const wrapper = mount(MgTag, { props: { closable: true } })
    await wrapper.get('.mg-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
