<template>
  <component :is="tag" v-bind="$attrs" class="mg-col" :style="colStyles"><slot /></component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { mgRowGutterKey } from '../row/context'

export interface MgColBreakpoint { span?: number; offset?: number; push?: number; pull?: number }
export type MgColResponsive = number | MgColBreakpoint
defineOptions({ name: 'MgCol', inheritAttrs: false })
const props = withDefaults(defineProps<{
  span?: number; offset?: number; push?: number; pull?: number
  xs?: MgColResponsive; sm?: MgColResponsive; md?: MgColResponsive; lg?: MgColResponsive; xl?: MgColResponsive
  tag?: string
}>(), { span: 24, offset: 0, push: 0, pull: 0, tag: 'div' })

const gutter = inject(mgRowGutterKey, computed(() => 0))
const normalize = (value?: MgColResponsive): MgColBreakpoint => typeof value === 'number' ? { span: value } : (value ?? {})
const clamp = (value: number) => Math.min(24, Math.max(0, value))
const colStyles = computed(() => {
  const style: Record<string, string> = {
    '--mg-col-span': String(clamp(props.span)), '--mg-col-offset': String(clamp(props.offset)),
    '--mg-col-push': String(clamp(props.push)), '--mg-col-pull': String(clamp(props.pull)),
  }
  for (const breakpoint of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
    const config = normalize(props[breakpoint])
    for (const key of ['span', 'offset', 'push', 'pull'] as const) {
      if (config[key] !== undefined) style[`--mg-col-${breakpoint}-${key}`] = String(clamp(config[key]))
    }
  }
  if (gutter.value > 0) {
    style.paddingLeft = `${gutter.value / 2}px`
    style.paddingRight = `${gutter.value / 2}px`
  }
  return style
})
</script>

<style scoped>
.mg-col {
  --mg-col-current-span: var(--mg-col-span, 24); --mg-col-current-offset: var(--mg-col-offset, 0);
  --mg-col-current-push: var(--mg-col-push, 0); --mg-col-current-pull: var(--mg-col-pull, 0);
  box-sizing: border-box; position: relative;
  left: calc(var(--mg-col-current-push) * 100% / 24); right: calc(var(--mg-col-current-pull) * 100% / 24);
  flex: 0 0 calc(var(--mg-col-current-span) * 100% / 24); max-width: calc(var(--mg-col-current-span) * 100% / 24);
  margin-left: calc(var(--mg-col-current-offset) * 100% / 24);
}
@media (max-width: 767px) { .mg-col { --mg-col-current-span: var(--mg-col-xs-span, var(--mg-col-span)); --mg-col-current-offset: var(--mg-col-xs-offset, var(--mg-col-offset)); --mg-col-current-push: var(--mg-col-xs-push, var(--mg-col-push)); --mg-col-current-pull: var(--mg-col-xs-pull, var(--mg-col-pull)); } }
@media (min-width: 768px) { .mg-col { --mg-col-current-span: var(--mg-col-sm-span, var(--mg-col-span)); --mg-col-current-offset: var(--mg-col-sm-offset, var(--mg-col-offset)); --mg-col-current-push: var(--mg-col-sm-push, var(--mg-col-push)); --mg-col-current-pull: var(--mg-col-sm-pull, var(--mg-col-pull)); } }
@media (min-width: 992px) { .mg-col { --mg-col-current-span: var(--mg-col-md-span, var(--mg-col-sm-span, var(--mg-col-span))); --mg-col-current-offset: var(--mg-col-md-offset, var(--mg-col-sm-offset, var(--mg-col-offset))); --mg-col-current-push: var(--mg-col-md-push, var(--mg-col-sm-push, var(--mg-col-push))); --mg-col-current-pull: var(--mg-col-md-pull, var(--mg-col-sm-pull, var(--mg-col-pull))); } }
@media (min-width: 1200px) { .mg-col { --mg-col-current-span: var(--mg-col-lg-span, var(--mg-col-md-span, var(--mg-col-span))); --mg-col-current-offset: var(--mg-col-lg-offset, var(--mg-col-md-offset, var(--mg-col-offset))); --mg-col-current-push: var(--mg-col-lg-push, var(--mg-col-md-push, var(--mg-col-push))); --mg-col-current-pull: var(--mg-col-lg-pull, var(--mg-col-md-pull, var(--mg-col-pull))); } }
@media (min-width: 1920px) { .mg-col { --mg-col-current-span: var(--mg-col-xl-span, var(--mg-col-lg-span, var(--mg-col-span))); --mg-col-current-offset: var(--mg-col-xl-offset, var(--mg-col-lg-offset, var(--mg-col-offset))); --mg-col-current-push: var(--mg-col-xl-push, var(--mg-col-lg-push, var(--mg-col-push))); --mg-col-current-pull: var(--mg-col-xl-pull, var(--mg-col-lg-pull, var(--mg-col-pull))); } }
</style>
