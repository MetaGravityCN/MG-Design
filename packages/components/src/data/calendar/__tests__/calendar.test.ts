import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgCalendar } from '../index'

describe('MgCalendar', () => {
  it('renders a complete month grid and updates selection', async () => {
    const wrapper = mount(MgCalendar, { props: { modelValue: new Date(2026, 6, 12) } })
    expect(wrapper.findAll('.mg-calendar__cell')).toHaveLength(42)
    expect(wrapper.text()).toContain('2026 年 7 月')

    const target = wrapper.find('[aria-label="2026-07-15"]')
    await target.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date
    expect(emitted.getFullYear()).toBe(2026)
    expect(emitted.getMonth()).toBe(6)
    expect(emitted.getDate()).toBe(15)
  })

  it('renders the date-cell scoped slot', () => {
    const wrapper = mount(MgCalendar, {
      props: { modelValue: new Date(2026, 6, 12) },
      slots: { 'date-cell': '<template #date-cell="{ data }"><i>{{ data.day }}</i></template>' },
    })
    expect(wrapper.findAll('i')).toHaveLength(42)
    expect(wrapper.text()).toContain('2026-07-12')
  })
})
