import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MgContainer } from '../index'
import { MgAside } from '../../aside'
import { MgHeader } from '../../header'
import { MgMain } from '../../main'

describe('MgContainer', () => {
  it('defaults to horizontal for aside and main', () => {
    const wrapper = mount(MgContainer, { slots: { default: () => [h(MgAside), h(MgMain)] } })
    expect(wrapper.classes()).toContain('is-horizontal')
  })

  it('detects header children and switches to vertical', () => {
    const wrapper = mount(MgContainer, { slots: { default: () => [h(MgHeader), h(MgMain)] } })
    expect(wrapper.classes()).toContain('is-vertical')
  })
})
