<template>
  <div v-bind="$attrs" class="mg-watermark" :style="rootStyle">
    <slot />
    <div class="mg-watermark__layer" aria-hidden="true" :style="layerStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({ name: 'MgWatermark', inheritAttrs: false })
const props = withDefaults(defineProps<{
  content?: string | string[]
  width?: number
  height?: number
  gapX?: number
  gapY?: number
  offsetLeft?: number
  offsetTop?: number
  rotate?: number
  color?: string
  fontSize?: string | number
  fontWeight?: string | number
  fontFamily?: string
  zIndex?: number
}>(), {
  content: 'MG Design', width: 120, height: 64, gapX: 100, gapY: 100,
  rotate: -22, color: 'rgba(0, 0, 0, 0.15)', fontSize: 16,
  fontWeight: 400, fontFamily: 'sans-serif', zIndex: 9,
})
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!)
const lines = computed(() => Array.isArray(props.content) ? props.content : [props.content])
const tileWidth = computed(() => props.width + props.gapX)
const tileHeight = computed(() => props.height + props.gapY)
const dataUrl = computed(() => {
  const size = typeof props.fontSize === 'number' ? props.fontSize : Number.parseFloat(props.fontSize) || 16
  const centerY = props.height / 2 - ((lines.value.length - 1) * size * 1.2) / 2
  const text = lines.value.map((line, index) => `<text x="${props.width / 2}" y="${centerY + index * size * 1.2}" dominant-baseline="middle" text-anchor="middle">${escapeXml(line)}</text>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth.value}" height="${tileHeight.value}"><g transform="translate(${props.width / 2} ${props.height / 2}) rotate(${props.rotate}) translate(${-props.width / 2} ${-props.height / 2})" fill="${escapeXml(props.color)}" font-family="${escapeXml(props.fontFamily)}" font-size="${size}" font-weight="${props.fontWeight}">${text}</g></svg>`
  return `url(data:image/svg+xml,${encodeURIComponent(svg)})`
})
const rootStyle = computed<CSSProperties>(() => ({ position: 'relative' }))
const layerStyle = computed<CSSProperties & Record<'--mg-watermark-image', string>>(() => ({
  zIndex: props.zIndex,
  '--mg-watermark-image': dataUrl.value,
  backgroundPosition: `${props.offsetLeft ?? props.gapX / 2}px ${props.offsetTop ?? props.gapY / 2}px`,
  backgroundRepeat: 'repeat',
  backgroundSize: `${tileWidth.value}px ${tileHeight.value}px`,
}))
</script>

<style scoped>
.mg-watermark__layer { position: absolute; inset: 0; pointer-events: none; background-image: var(--mg-watermark-image); }
</style>
