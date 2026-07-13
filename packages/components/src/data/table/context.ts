import type { InjectionKey, Slots } from 'vue'
export interface TableColumnConfig { id:string; prop?:string; label?:string; type?:'default'|'selection'|'index'|'expand'; width?:string|number; minWidth?:string|number; sortable?:boolean|'custom'; align?:'left'|'center'|'right'; headerAlign?:'left'|'center'|'right'; fixed?:boolean|'left'|'right'; formatter?:(row:Record<string,unknown>,column:TableColumnConfig,value:unknown,index:number)=>unknown; selectable?:(row:Record<string,unknown>,index:number)=>boolean; index?:number|((index:number)=>number); slots:Slots }
export interface TableContext { register:(column:TableColumnConfig)=>void; unregister:(id:string)=>void }
export const tableContextKey:InjectionKey<TableContext>=Symbol('mg-table')
