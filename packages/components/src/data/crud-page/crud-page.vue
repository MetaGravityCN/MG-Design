<template>
  <div class="mg-crud-page">
    <!-- 搜索区 -->
    <div v-if="$slots.search" class="mg-search-form">
      <slot name="search" />
      <MgButton type="primary" @click="handleSearch">查询</MgButton>
      <MgButton @click="handleReset">重置</MgButton>
    </div>

    <!-- 工具栏 -->
    <div v-if="$slots.toolbar" class="mg-table-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 表格 -->
    <MgLoading class="mg-card" :loading="loading">
      <MgTable :data="data" style="width: 100%">
        <MgTableColumn
          v-for="col in columns"
          :key="col.prop || col.label"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :fixed="col.fixed"
          :show-overflow-tooltip="col.showOverflowTooltip"
        >
          <template v-if="col.slot" #default="scope">
            <slot :name="`column-${col.slot}`" v-bind="scope" />
          </template>
          <template v-else-if="col.type === 'tag' && col.tagMap" #default="scope">
            <MgTag :type="resolveTagType(scope.row, col)" size="small">
              {{
                col.tagTextMap?.[getColumnValue(scope.row, col)] ?? getColumnValue(scope.row, col)
              }}
            </MgTag>
          </template>
          <template v-else-if="col.formatter" #default="scope">
            {{ formatColumnValue(scope.row, col) }}
          </template>
        </MgTableColumn>
        <MgTableColumn
          v-if="$slots.actions"
          label="操作"
          :width="actionsWidth"
          :fixed="actionsFixed"
        >
          <template #default="scope">
            <slot name="actions" v-bind="scope" />
          </template>
        </MgTableColumn>
      </MgTable>
      <div v-if="showPagination" class="mg-crud-pagination">
        <MgPagination
          :current-page="innerCurrentPage"
          :page-size="innerPageSize"
          :total="total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </MgLoading>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MgTable } from '../table'
import { MgTableColumn } from '../table-column'
import { MgButton } from '../../basic/button'
import { MgTag } from '../tag'
import type { MgTagType } from '../tag'
import { MgPagination } from '../pagination'
import { MgLoading } from '../../feedback/loading'

export interface MgCrudColumn {
  /** 数据字段名 */
  prop?: string
  /** 列标题 */
  label?: string
  /** 列宽度 */
  width?: string | number
  /** 固定列 */
  fixed?: 'left' | 'right'
  /** 是否省略号显示 */
  showOverflowTooltip?: boolean
  /** 自定义插槽名（对应 #column-{slot}） */
  slot?: string
  /** 列渲染类型：tag - 标签 */
  type?: 'tag'
  /** type=tag 时：根据 row[prop] 值映射 MgTag 的 type */
  tagMap?: Record<string | number, MgTagType>
  /** type=tag 时：自定义显示文本映射 */
  tagTextMap?: Record<string | number, string>
  /** 自定义格式化函数 */
  formatter?: (value: any, row: Record<string, any>) => string
}

export interface MgCrudPageProps {
  /** 表格数据 */
  data: any[]
  /** 列定义 */
  columns: MgCrudColumn[]
  /** 加载状态 */
  loading?: boolean
  /** 总条数（分页模式时必填） */
  total?: number
  /** 当前页（v-model:current-page） */
  currentPage?: number
  /** 每页条数（v-model:page-size） */
  pageSize?: number
  /** 是否显示分页 */
  pagination?: boolean
  /** 操作列宽度 */
  actionsWidth?: string | number
  /** 操作列固定方向 */
  actionsFixed?: 'left' | 'right'
  /** 是否显示默认查询/重置按钮（当 #search slot 存在时） */
  showDefaultSearchButtons?: boolean
}

const props = withDefaults(defineProps<MgCrudPageProps>(), {
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pagination: true,
  actionsWidth: 200,
  actionsFixed: 'right',
  showDefaultSearchButtons: true,
})

const emit = defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
  (e: 'add'): void
  (e: 'update:currentPage', val: number): void
  (e: 'update:pageSize', val: number): void
  (e: 'page-change', page: number, size: number): void
}>()

const innerCurrentPage = ref(props.currentPage)
const innerPageSize = ref(props.pageSize)

watch(
  () => props.currentPage,
  (val) => {
    innerCurrentPage.value = val
  }
)

watch(
  () => props.pageSize,
  (val) => {
    innerPageSize.value = val
  }
)

const showPagination = computed(() => props.pagination)

const getColumnValue = (row: Record<string, any>, column: MgCrudColumn) =>
  column.prop ? row[column.prop] : ''

const resolveTagType = (row: Record<string, any>, column: MgCrudColumn) =>
  column.tagMap?.[getColumnValue(row, column)] || 'info'

const formatColumnValue = (row: Record<string, any>, column: MgCrudColumn) =>
  column.formatter?.(getColumnValue(row, column), row) ?? ''

const handleSearch = () => emit('search')
const handleReset = () => emit('reset')

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
  emit('page-change', page, innerPageSize.value)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('page-change', innerCurrentPage.value, size)
}

defineOptions({ name: 'MgCrudPage' })
</script>

<style scoped>
.mg-crud-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mg-crud-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
