<template><span class="mg-carousel-item" aria-hidden="true" /></template>
<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, watch, type Slot } from 'vue'
import { useStableId } from '@metagravity_cn/primitives'
import { carouselContextKey, type CarouselItemConfig } from '../carousel/context'
defineOptions({ name: 'MgCarouselItem' })
const props = defineProps<{ name?: string | number; label?: string }>()
const context = inject(carouselContextKey)
const slots = defineSlots<{ default?: Slot }>()
const id = useStableId(undefined, 'mg-carousel-item')
const config = (): CarouselItemConfig => ({ id, name: props.name, label: props.label, slot: slots.default })
onMounted(() => context?.register(config()))
watch(props, () => context?.register(config()), { deep: true })
onBeforeUnmount(() => context?.unregister(id))
</script>
<style scoped>.mg-carousel-item { display: none; }</style>
