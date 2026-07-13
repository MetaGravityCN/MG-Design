<template><span class="mg-tab-pane" aria-hidden="true" /></template>
<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { useStableId } from '@metagravity_cn/primitives'
import { tabsContextKey, type TabName, type TabPaneConfig } from '../tabs/context'
defineOptions({ name: 'MgTabPane' })
const props = defineProps<{ label?: string; name: TabName; disabled?: boolean; closable?: boolean; lazy?: boolean }>()
const context = inject(tabsContextKey); const slots = useSlots(); const id = useStableId(undefined, 'mg-tab-pane')
const config = (): TabPaneConfig => ({ id, name: props.name, label: props.label, disabled: props.disabled, closable: props.closable, lazy: props.lazy, slots })
onMounted(() => context?.register(config())); watch(props, () => context?.register(config()), { deep: true }); onBeforeUnmount(() => context?.unregister(id))
</script>
<style scoped>.mg-tab-pane { display: none; }</style>
