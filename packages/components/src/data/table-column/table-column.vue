<template>
  <span class="mg-table-column" aria-hidden="true" />
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { useStableId } from '@mg-design/primitives'
import { tableContextKey, type TableColumnConfig } from '../table/context'

defineOptions({ name: 'MgTableColumn' })

const props = withDefaults(
  defineProps<{
    prop?: string
    property?: string
    label?: string
    type?: 'default' | 'selection' | 'index' | 'expand'
    width?: string | number
    minWidth?: string | number
    sortable?: boolean | 'custom'
    align?: 'left' | 'center' | 'right'
    headerAlign?: 'left' | 'center' | 'right'
    fixed?: boolean | 'left' | 'right'
    formatter?: TableColumnConfig['formatter']
    selectable?: TableColumnConfig['selectable']
    index?: number | ((index: number) => number)
  }>(),
  { type: 'default', align: 'left' },
)

const table = inject(tableContextKey)
const slots = useSlots()
const id = useStableId(undefined, 'mg-table-column')

const config = (): TableColumnConfig => ({
  id,
  prop: props.prop || props.property,
  label: props.label,
  type: props.type,
  width: props.width,
  minWidth: props.minWidth,
  sortable: props.sortable,
  align: props.align,
  headerAlign: props.headerAlign,
  fixed: props.fixed,
  formatter: props.formatter,
  selectable: props.selectable,
  index: props.index,
  slots,
})

onMounted(() => table?.register(config()))
watch(props, () => table?.register(config()), { deep: true })
onBeforeUnmount(() => table?.unregister(id))
</script>

<style scoped>
.mg-table-column {
  display: none;
}
</style>
