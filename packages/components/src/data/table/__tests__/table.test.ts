import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { MgTable } from '../index'
import { MgTableColumn } from '../../table-column'

const rows = [
  { id: 1, name: 'Charlie', score: 2 },
  { id: 2, name: 'Alice', score: 10 },
]

function mountTable() {
  return mount({
    components: { MgTable, MgTableColumn },
    setup() {
      const selection = ref<unknown[]>([])
      return { rows, selection }
    },
    template: `
      <MgTable :data="rows" border @selection-change="selection = $event">
        <MgTableColumn type="selection" width="44" />
        <MgTableColumn prop="name" label="姓名">
          <template #default="{ row }"><strong>{{ row.name }}</strong></template>
        </MgTableColumn>
        <MgTableColumn prop="score" label="得分" sortable />
      </MgTable>
    `,
  })
}

describe('MgTable', () => {
  it('registers columns and renders scoped cell slots', async () => {
    const wrapper = mountTable()
    await nextTick()

    expect(wrapper.find('.mg-table').exists()).toBe(true)
    expect(wrapper.findAll('th')).toHaveLength(3)
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.findAll('strong').map((node) => node.text())).toEqual(['Charlie', 'Alice'])
  })

  it('supports native selection and sorting', async () => {
    const wrapper = mountTable()
    await nextTick()

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true)
    expect((wrapper.vm as unknown as { selection: unknown[] }).selection).toEqual([rows[0]])

    const scoreHeader = wrapper.findAll('th')[2]
    await scoreHeader.trigger('click')
    expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([
      'Charlie2',
      'Alice10',
    ])
    await scoreHeader.trigger('click')
    expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([
      'Alice10',
      'Charlie2',
    ])
  })
})
