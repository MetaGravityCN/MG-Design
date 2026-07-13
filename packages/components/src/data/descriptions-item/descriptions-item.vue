<template>
  <span class="mg-descriptions-item" aria-hidden="true" />
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { useStableId } from '@metagravity_cn/primitives'
import { descriptionsContextKey, type DescriptionItemConfig } from '../descriptions/context'

defineOptions({ name: 'MgDescriptionsItem' })

const props = withDefaults(
  defineProps<{
    label?: string | number
    width?: string | number
    minWidth?: string | number
    span?: number
    rowspan?: number
    align?: 'left' | 'center' | 'right'
    labelAlign?: 'left' | 'center' | 'right'
    className?: string
    labelClassName?: string
  }>(),
  { span: 1, rowspan: 1 },
)

const context = inject(descriptionsContextKey)
const slots = useSlots()
const id = useStableId(undefined, 'mg-description-item')
const config = (): DescriptionItemConfig => ({
  id,
  label: props.label,
  width: props.width,
  minWidth: props.minWidth,
  span: props.span,
  rowspan: props.rowspan,
  align: props.align,
  labelAlign: props.labelAlign,
  className: props.className,
  labelClassName: props.labelClassName,
  slots,
})

onMounted(() => context?.register(config()))
watch(props, () => context?.register(config()), { deep: true })
onBeforeUnmount(() => context?.unregister(id))
</script>

<style scoped>
.mg-descriptions-item { display: none; }
</style>
