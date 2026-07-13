import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MgSpace from '../src/basic/space/space.vue'

describe('MgSpace', () => {
  it('renders children with the MG layout contract', () => {
    const wrapper = mount(MgSpace, { slots: { default: '<button>A</button><button>B</button>' } })
    expect(wrapper.classes()).toContain('mg-space')
    expect(wrapper.findAll('.mg-space__item')).toHaveLength(2)
  })

  it('supports vertical direction and numeric spacing', () => {
    const wrapper = mount(MgSpace, { props: { direction: 'vertical', size: 20 } })
    expect(wrapper.classes()).toContain('mg-space--vertical')
    expect(wrapper.attributes('style')).toContain('row-gap: 20px')
  })
})
