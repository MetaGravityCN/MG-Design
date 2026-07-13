import type { App, Directive, ObjectDirective } from 'vue'
import { lockDocumentScroll, overlayManager, type OverlayHandle } from '@mg-design/primitives'
import Loading from './loading.vue'
import { createLoadingMask, type MgLoadingMaskOptions } from './loading-mask'
import './loading.css'

export interface MgLoadingOptions extends MgLoadingMaskOptions {
  target?: string | HTMLElement
  body?: boolean
  lock?: boolean
  beforeClose?: () => boolean | void
  closed?: () => void
}
export interface MgLoadingInstance {
  close: () => void
  setText: (text: string) => void
  element: HTMLElement
}

function resolveTarget(target?: string | HTMLElement) {
  if (target instanceof HTMLElement) return target
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? document.body
  return document.body
}
export function createLoadingService(options: MgLoadingOptions = {}): MgLoadingInstance {
  if (typeof document === 'undefined') return { close: () => undefined, setText: () => undefined, element: {} as HTMLElement }
  const target = resolveTarget(options.target)
  const fullscreen = options.fullscreen ?? target === document.body
  let overlayHandle: OverlayHandle | undefined
  if (fullscreen) overlayHandle = overlayManager.open({ type: 'custom' })
  const mask = createLoadingMask({ ...options, fullscreen, zIndex: options.zIndex ?? overlayHandle?.record.zIndex ?? 10 })
  const host = options.body ? document.body : target
  const originalPosition = target.style.position
  if (!fullscreen && getComputedStyle(target).position === 'static') target.style.position = 'relative'
  host.appendChild(mask.element)
  const unlock = options.lock ? lockDocumentScroll() : undefined
  let closed = false
  const close = () => {
    if (closed || options.beforeClose?.() === false) return
    closed = true; mask.element.classList.add('is-leaving')
    window.setTimeout(() => {
      mask.element.remove()
      if (!fullscreen) target.style.position = originalPosition
      unlock?.(); overlayHandle?.release(); options.closed?.()
    }, 200)
  }
  return { close, setText: mask.setText, element: mask.element }
}

interface DirectiveState { instance?: ReturnType<typeof createLoadingMask>; originalPosition: string }
const directiveStates = new WeakMap<HTMLElement, DirectiveState>()
function readDirectiveOptions(element: HTMLElement): MgLoadingMaskOptions {
  return {
    text: element.getAttribute('mg-loading-text') ?? '',
    background: element.getAttribute('mg-loading-background') ?? undefined,
    spinner: element.getAttribute('mg-loading-spinner') ?? undefined,
    svg: element.getAttribute('mg-loading-svg') ?? undefined,
    svgViewBox: element.getAttribute('mg-loading-svg-view-box') ?? undefined,
  }
}
function updateDirective(element: HTMLElement, loading: boolean) {
  const state = directiveStates.get(element) ?? { originalPosition: element.style.position }
  if (loading && !state.instance) {
    if (getComputedStyle(element).position === 'static') element.style.position = 'relative'
    state.instance = createLoadingMask(readDirectiveOptions(element)); element.appendChild(state.instance.element)
    element.setAttribute('aria-busy', 'true')
  } else if (!loading && state.instance) {
    state.instance.element.remove(); state.instance = undefined
    element.style.position = state.originalPosition; element.removeAttribute('aria-busy')
  }
  directiveStates.set(element, state)
}
export const vLoading: ObjectDirective<HTMLElement, boolean> = {
  mounted: (element, binding) => updateDirective(element, Boolean(binding.value)),
  updated: (element, binding) => updateDirective(element, Boolean(binding.value)),
  unmounted: (element) => { updateDirective(element, false); directiveStates.delete(element) },
}

type MgLoadingComponent = typeof Loading & {
  install: (app: App) => void
  service: typeof createLoadingService
  directive: Directive<HTMLElement, boolean>
}
const MgLoading = Loading as MgLoadingComponent
MgLoading.install = (app: App) => { app.component('MgLoading', Loading); app.directive('loading', vLoading) }
MgLoading.service = createLoadingService
MgLoading.directive = vLoading

export { MgLoading }
export default MgLoading
