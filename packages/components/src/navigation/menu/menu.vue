<template><nav v-bind="$attrs" :class="['mg-menu', `mg-menu--${mode}`, { 'is-collapsed': collapse }]" :style="menuStyle" aria-label="导航菜单"><slot /></nav></template>
<script setup lang="ts">
import { computed, provide, ref, watch, type CSSProperties } from 'vue'
import { menuContextKey } from './context'
defineOptions({ name: 'MgMenu', inheritAttrs: false })
const props = withDefaults(defineProps<{ defaultActive?: string; mode?: 'horizontal' | 'vertical'; collapse?: boolean; defaultOpeneds?: string[]; uniqueOpened?: boolean; menuTrigger?: 'hover' | 'click'; backgroundColor?: string; textColor?: string; activeTextColor?: string; router?: boolean }>(), { defaultActive: '', mode: 'vertical', defaultOpeneds: () => [], menuTrigger: 'hover', backgroundColor: '#fff', textColor: '#424a57', activeTextColor: '#0052d9' })
const emit = defineEmits<{ select: [index: string, indexPath: string[]]; open: [index: string, indexPath: string[]]; close: [index: string, indexPath: string[]] }>()
const activeIndex = ref(props.defaultActive); const openIndexes = ref(new Set(props.defaultOpeneds))
watch(() => props.defaultActive, (value) => { activeIndex.value = value })
const menuStyle = computed<CSSProperties & Record<string, string>>(() => ({ backgroundColor: props.backgroundColor, color: props.textColor, '--mg-menu-active-color': props.activeTextColor }))
function select(index: string) { activeIndex.value = index; emit('select', index, [index]) }
function toggle(index: string) { const next = new Set(openIndexes.value); const opening = !next.has(index); if (opening) { if (props.uniqueOpened) next.clear(); next.add(index) } else next.delete(index); openIndexes.value = next; if (opening) emit('open', index, [index]); else emit('close', index, [index]) }
provide(menuContextKey, { active: () => activeIndex.value, opened: (index) => openIndexes.value.has(index), select, toggle, collapse: () => props.collapse })
defineExpose({ open: (index: string) => { if (!openIndexes.value.has(index)) toggle(index) }, close: (index: string) => { if (openIndexes.value.has(index)) toggle(index) }, activeIndex, openIndexes })
</script>
<style scoped>
.mg-menu { box-sizing: border-box; margin: 0; padding: 0; border-right: 1px solid var(--mg-color-border-light, #ebecef); }.mg-menu--horizontal { display: flex; border-right: 0; border-bottom: 1px solid var(--mg-color-border-light, #ebecef); }.mg-menu.is-collapsed { width: 64px; }
</style>
