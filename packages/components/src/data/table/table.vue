<template>
  <div v-bind="$attrs" :class="classes" :style="rootStyle">
    <div class="mg-table__columns"><slot /></div>
    <div class="mg-table__scroll">
      <table>
        <thead v-if="showHeader">
          <tr>
            <th
              v-for="column in columns"
              :key="column.id"
              :style="cellStyle(column, true)"
              :class="headerClasses(column)"
              @click="toggleSort(column)"
            >
              <input
                v-if="column.type === 'selection'"
                type="checkbox"
                :checked="allSelected"
                :indeterminate.prop="someSelected"
                aria-label="全选"
                @change="toggleAllSelection"
              >
              <SlotRenderer
                v-else-if="column.slots.header"
                :render="column.slots.header"
                :scope="{ column, $index: 0 }"
              />
              <span v-else>{{ column.label }}</span>
              <span v-if="column.sortable" class="mg-table__sort">{{ sortIcon(column) }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in displayData" :key="rowIdentity(row, index)">
            <tr
              :class="rowClasses(row, index)"
              :style="rowStyles(row, index)"
              @click="onRowClick(row, index)"
              @dblclick="emit('row-dblclick', row, index)"
            >
              <td
                v-for="column in columns"
                :key="column.id"
                :style="cellStyle(column, false)"
                :class="cellClasses(column)"
                @click="emit('cell-click', row, column, $event)"
              >
                <input
                  v-if="column.type === 'selection'"
                  type="checkbox"
                  :checked="isSelected(row)"
                  :disabled="column.selectable && !column.selectable(row, index)"
                  aria-label="选择行"
                  @click.stop
                  @change="toggleRowSelection(row)"
                >
                <span v-else-if="column.type === 'index'">
                  {{ typeof column.index === 'function' ? column.index(index) : index + (column.index || 1) }}
                </span>
                <button
                  v-else-if="column.type === 'expand'"
                  type="button"
                  class="mg-table__expand"
                  @click.stop="toggleExpand(row)"
                >{{ isExpanded(row) ? '−' : '+' }}</button>
                <SlotRenderer
                  v-else-if="column.slots.default"
                  :render="column.slots.default"
                  :scope="{ row, column, $index: index }"
                />
                <span v-else>{{ formatCell(row, column, index) }}</span>
              </td>
            </tr>
            <tr v-if="isExpanded(row)" class="mg-table__expanded">
              <td :colspan="columns.length">
                <SlotRenderer
                  v-if="expandColumn?.slots.default"
                  :render="expandColumn.slots.default"
                  :scope="{ row, $index: index }"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-if="!displayData.length" class="mg-table__empty">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
      <div v-if="loading" class="mg-table__loading">加载中…</div>
    </div>
    <slot name="append" />
  </div>
</template>
<script setup lang="ts">
import{computed,defineComponent,provide,ref,type CSSProperties,type Slot}from'vue';import{getValueAtPath}from'@metagravity_cn/primitives';import{tableContextKey,type TableColumnConfig}from'./context'
type Row=Record<string,unknown>;defineOptions({name:'MgTable',inheritAttrs:false});const SlotRenderer=defineComponent((props:{render?:Slot;scope?:Record<string,unknown>})=>()=>props.render?.(props.scope),{props:['render','scope']});const props=withDefaults(defineProps<{data?:Row[];height?:string|number;maxHeight?:string|number;stripe?:boolean;border?:boolean;size?:'large'|'default'|'small';fit?:boolean;showHeader?:boolean;highlightCurrentRow?:boolean;currentRowKey?:string|number;rowKey?:string|((row:Row)=>string|number);emptyText?:string;defaultSort?:{prop:string;order:'ascending'|'descending'};rowClassName?:string|((args:{row:Row;rowIndex:number})=>string);rowStyle?:CSSProperties|((args:{row:Row;rowIndex:number})=>CSSProperties);cellClassName?:string;headerCellClassName?:string;loading?:boolean}>(),{data:()=>[],fit:true,showHeader:true,emptyText:'暂无数据'});const emit=defineEmits<{select:[selection:Row[],row:Row];'select-all':[selection:Row[]];'selection-change':[selection:Row[]];'cell-click':[row:Row,column:TableColumnConfig,cell:Event];'row-click':[row:Row,index:number];'row-dblclick':[row:Row,index:number];'current-change':[current:Row,old?:Row];'sort-change':[data:{column:TableColumnConfig;prop?:string;order:null|'ascending'|'descending'}];'expand-change':[row:Row,expanded:boolean]}>();const columns=ref<TableColumnConfig[]>([]);const selection=ref<Row[]>([]);const expanded=ref<Row[]>([]);const currentRow=ref<Row>();const sortProp=ref(props.defaultSort?.prop);const sortOrder=ref<null|'ascending'|'descending'>(props.defaultSort?.order||null);function register(column:TableColumnConfig){const index=columns.value.findIndex(item=>item.id===column.id);index>=0?columns.value.splice(index,1,column):columns.value.push(column)}function unregister(id:string){columns.value=columns.value.filter(item=>item.id!==id)}provide(tableContextKey,{register,unregister});const displayData=computed(()=>{if(!sortProp.value||!sortOrder.value)return props.data;return[...props.data].sort((a,b)=>{const av=getValueAtPath(a,sortProp.value!),bv=getValueAtPath(b,sortProp.value!);const result=String(av??'').localeCompare(String(bv??''),undefined,{numeric:true});return sortOrder.value==='ascending'?result:-result})});const expandColumn=computed(()=>columns.value.find(c=>c.type==='expand'));const classes=computed(()=>['mg-table',props.size&&`mg-table--${props.size}`,{'is-striped':props.stripe,'is-bordered':props.border,'is-fit':props.fit}]);const rootStyle=computed<CSSProperties>(()=>({height:typeof props.height==='number'?`${props.height}px`:props.height,maxHeight:typeof props.maxHeight==='number'?`${props.maxHeight}px`:props.maxHeight}));const rowIdentity=(row:Row,index:number)=>typeof props.rowKey==='function'?props.rowKey(row):props.rowKey?String(getValueAtPath(row,props.rowKey)):index;const isSelected=(row:Row)=>selection.value.includes(row);const allSelected=computed(()=>props.data.length>0&&props.data.every(isSelected));const someSelected=computed(()=>selection.value.length>0&&!allSelected.value);const isExpanded=(row:Row)=>expanded.value.includes(row);function formatCell(row:Row,column:TableColumnConfig,index:number){const value=column.prop?getValueAtPath(row,column.prop):undefined;return column.formatter?column.formatter(row,column,value,index):value??''}function cellStyle(column:TableColumnConfig,header:boolean):CSSProperties{return{width:typeof column.width==='number'?`${column.width}px`:column.width,minWidth:typeof column.minWidth==='number'?`${column.minWidth}px`:column.minWidth,textAlign:header?(column.headerAlign||column.align):column.align,position:column.fixed?'sticky':undefined,[column.fixed==='right'?'right':'left']:column.fixed?'0':undefined}}function cellClasses(column:TableColumnConfig){return['mg-table__cell',`is-${column.align||'left'}`,props.cellClassName]}function headerClasses(column:TableColumnConfig){return['mg-table__header-cell',`is-${column.headerAlign||column.align||'left'}`,column.sortable&&'is-sortable',props.headerCellClassName]}function rowClasses(row:Row,index:number){const custom=typeof props.rowClassName==='function'?props.rowClassName({row,rowIndex:index}):props.rowClassName;return[custom,{'is-current':currentRow.value===row||props.currentRowKey===rowIdentity(row,index)}]}function rowStyles(row:Row,index:number){return typeof props.rowStyle==='function'?props.rowStyle({row,rowIndex:index}):props.rowStyle}function onRowClick(row:Row,index:number){const old=currentRow.value;currentRow.value=row;emit('row-click',row,index);if(old!==row)emit('current-change',row,old)}function toggleRowSelection(row:Row,selected?:boolean){const shouldSelect=selected??!isSelected(row);selection.value=shouldSelect?[...selection.value.filter(item=>item!==row),row]:selection.value.filter(item=>item!==row);emit('select',[...selection.value],row);emit('selection-change',[...selection.value])}function toggleAllSelection(){selection.value=allSelected.value?[]:props.data.filter((row,index)=>{const column=columns.value.find(c=>c.type==='selection');return !column?.selectable||column.selectable(row,index)});emit('select-all',[...selection.value]);emit('selection-change',[...selection.value])}function clearSelection(){selection.value=[];emit('selection-change',[])}function toggleExpand(row:Row){expanded.value=isExpanded(row)?expanded.value.filter(item=>item!==row):[...expanded.value,row];emit('expand-change',row,isExpanded(row))}function toggleSort(column:TableColumnConfig){if(!column.sortable||!column.prop)return;sortProp.value=column.prop;sortOrder.value=sortOrder.value==='ascending'?'descending':sortOrder.value==='descending'?null:'ascending';emit('sort-change',{column,prop:column.prop,order:sortOrder.value})}function sortIcon(column:TableColumnConfig){return sortProp.value===column.prop?(sortOrder.value==='ascending'?'↑':sortOrder.value==='descending'?'↓':'↕'):'↕'}function clearSort(){sortProp.value=undefined;sortOrder.value=null}function sort(prop:string,order:'ascending'|'descending'){sortProp.value=prop;sortOrder.value=order}function setCurrentRow(row:Row){const old=currentRow.value;currentRow.value=row;emit('current-change',row,old)}defineExpose({clearSelection,getSelectionRows:()=>[...selection.value],toggleRowSelection,toggleAllSelection,toggleRowExpansion:toggleExpand,setCurrentRow,clearSort,sort,columns})
</script>
<style scoped>.mg-table{position:relative;box-sizing:border-box;width:100%;color:var(--mg-color-text-regular,#424a57);font-size:14px}.mg-table__columns{display:none}.mg-table__scroll{position:relative;max-height:inherit;overflow:auto}.mg-table table{width:100%;border-spacing:0;border-collapse:collapse;table-layout:fixed}.mg-table th,.mg-table td{box-sizing:border-box;padding:10px 12px;border-bottom:1px solid var(--mg-color-border-light,#ebecef)}.mg-table th{color:var(--mg-color-text-primary,#202633);font-weight:600;background:var(--mg-color-fill-light,#f5f6f7)}.mg-table.is-striped tbody tr:nth-child(even){background:var(--mg-color-fill-lighter,#fafafa)}.mg-table tbody tr:hover,.mg-table tbody tr.is-current{background:var(--mg-color-primary-light-9,#f2f3ff)}.mg-table.is-bordered table,.mg-table.is-bordered th,.mg-table.is-bordered td{border:1px solid var(--mg-color-border,#dcdde1)}.mg-table__header-cell.is-sortable{cursor:pointer}.mg-table__sort{margin-left:5px;color:var(--mg-color-text-secondary,#6f7686)}.mg-table__expand{cursor:pointer;background:none;border:0}.mg-table__expanded td{background:#fff}.mg-table__empty{padding:40px;text-align:center;color:var(--mg-color-text-placeholder,#a1a7b3)}.mg-table__loading{position:absolute;inset:0;display:grid;place-items:center;background:#ffffffcc}.mg-table--large th,.mg-table--large td{padding:13px 14px}.mg-table--small th,.mg-table--small td{padding:6px 8px;font-size:12px}</style>
