<template>
  <section v-bind="$attrs" :class="classes">
    <div class="mg-descriptions__collector"><slot /></div>

    <header v-if="title || $slots.title || extra || $slots.extra" class="mg-descriptions__header">
      <div class="mg-descriptions__title"><slot name="title">{{ title }}</slot></div>
      <div class="mg-descriptions__extra"><slot name="extra">{{ extra }}</slot></div>
    </header>

    <div class="mg-descriptions__body" :style="gridStyle">
      <div
        v-for="item in items"
        :key="item.id"
        :class="['mg-descriptions__item', item.className]"
        :style="itemStyle(item)"
      >
        <div
          :class="['mg-descriptions__label', item.labelClassName]"
          :style="labelStyle(item)"
        >
          <SlotRenderer
            v-if="item.slots.label"
            :render="item.slots.label"
            :scope="{ label: item.label }"
          />
          <span v-else>{{ item.label }}</span>
        </div>
        <div class="mg-descriptions__content" :style="contentStyle(item)">
          <SlotRenderer v-if="item.slots.default" :render="item.slots.default" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, provide, ref, type CSSProperties, type Slot } from 'vue'
import { descriptionsContextKey, type DescriptionItemConfig } from './context'

defineOptions({ name: 'MgDescriptions', inheritAttrs: false })

const SlotRenderer = defineComponent(
  (props: { render?: Slot; scope?: Record<string, unknown> }) => () =>
    props.render?.(props.scope),
  { props: ['render', 'scope'] },
)

const props = withDefaults(
  defineProps<{
    border?: boolean
    column?: number
    direction?: 'horizontal' | 'vertical'
    size?: 'large' | 'default' | 'small'
    title?: string
    extra?: string
    labelWidth?: string | number
  }>(),
  { column: 3, direction: 'horizontal' },
)

const items = ref<DescriptionItemConfig[]>([])

function register(item: DescriptionItemConfig) {
  const index = items.value.findIndex((current) => current.id === item.id)
  if (index >= 0) items.value.splice(index, 1, item)
  else items.value.push(item)
}

function unregister(id: string) {
  items.value = items.value.filter((item) => item.id !== id)
}

provide(descriptionsContextKey, { register, unregister })

const classes = computed(() => [
  'mg-descriptions',
  `mg-descriptions--${props.direction}`,
  props.size && `mg-descriptions--${props.size}`,
  { 'is-bordered': props.border },
])
const gridStyle = computed<CSSProperties>(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, props.column)}, minmax(0, 1fr))`,
}))
const width = (value?: string | number) => (typeof value === 'number' ? `${value}px` : value)

function itemStyle(item: DescriptionItemConfig): CSSProperties {
  return {
    gridColumn: `span ${Math.min(Math.max(1, props.column), item.span)}`,
    gridRow: `span ${item.rowspan}`,
    minWidth: width(item.minWidth),
  }
}

function labelStyle(item: DescriptionItemConfig): CSSProperties {
  return { width: width(item.width ?? props.labelWidth), textAlign: item.labelAlign }
}

function contentStyle(item: DescriptionItemConfig): CSSProperties {
  return { textAlign: item.align }
}
</script>

<style scoped>
.mg-descriptions { color: var(--mg-color-text-regular, #424a57); font-size: 14px; }
.mg-descriptions__collector { display: none; }
.mg-descriptions__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.mg-descriptions__title { color: var(--mg-color-text-primary, #202633); font-size: 16px; font-weight: 600; }
.mg-descriptions__body { display: grid; gap: 12px 20px; }
.mg-descriptions__item { display: flex; min-width: 0; }
.mg-descriptions__label { flex: 0 0 auto; margin-right: 10px; color: var(--mg-color-text-secondary, #6f7686); font-weight: 500; }
.mg-descriptions__content { flex: 1; min-width: 0; word-break: break-word; }
.mg-descriptions--vertical .mg-descriptions__item { display: block; }
.mg-descriptions--vertical .mg-descriptions__label { margin: 0 0 6px; }
.mg-descriptions.is-bordered .mg-descriptions__body { gap: 0; border-top: 1px solid var(--mg-color-border, #dcdde1); border-left: 1px solid var(--mg-color-border, #dcdde1); }
.mg-descriptions.is-bordered .mg-descriptions__item { border-right: 1px solid var(--mg-color-border, #dcdde1); border-bottom: 1px solid var(--mg-color-border, #dcdde1); }
.mg-descriptions.is-bordered .mg-descriptions__label,
.mg-descriptions.is-bordered .mg-descriptions__content { box-sizing: border-box; padding: 10px 12px; }
.mg-descriptions.is-bordered .mg-descriptions__label { margin: 0; background: var(--mg-color-fill-light, #f5f6f7); }
.mg-descriptions--large .mg-descriptions__label,
.mg-descriptions--large .mg-descriptions__content { padding-block: 13px; }
.mg-descriptions--small { font-size: 12px; }
.mg-descriptions--small .mg-descriptions__label,
.mg-descriptions--small .mg-descriptions__content { padding-block: 7px; }
</style>
