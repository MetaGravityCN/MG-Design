import type { App, Directive, DirectiveBinding } from 'vue'
import InfiniteScroll from './infinite-scroll.vue'

interface InfiniteElement extends HTMLElement { __mgInfiniteCleanup?: () => void; __mgInfiniteCheck?: () => void }
function numberAttr(element: HTMLElement, name: string, fallback: number) { const value = Number(element.getAttribute(name)); return Number.isFinite(value) ? value : fallback }
function booleanAttr(element: HTMLElement, name: string, fallback: boolean) { const value = element.getAttribute(name); return value == null ? fallback : value !== 'false' }
function setup(element: InfiniteElement, binding: DirectiveBinding<() => void>) {
  element.__mgInfiniteCleanup?.(); let lastRun = 0; let timer: ReturnType<typeof setTimeout> | undefined
  const check = () => {
    if (booleanAttr(element, 'infinite-scroll-disabled', false)) return
    const distance = numberAttr(element, 'infinite-scroll-distance', 0)
    if (element.scrollHeight - element.scrollTop - element.clientHeight > distance) return
    const delay = numberAttr(element, 'infinite-scroll-delay', 200); const wait = Math.max(0, delay - (Date.now() - lastRun))
    if (timer) return
    timer = setTimeout(() => { timer = undefined; lastRun = Date.now(); binding.value?.() }, wait)
  }
  element.addEventListener('scroll', check, { passive: true }); element.__mgInfiniteCheck = check
  element.__mgInfiniteCleanup = () => { element.removeEventListener('scroll', check); if (timer) clearTimeout(timer) }
  if (booleanAttr(element, 'infinite-scroll-immediate', true)) queueMicrotask(check)
}
export const MgInfiniteScrollDirective: Directive<InfiniteElement, () => void> = { mounted: setup, updated: setup, unmounted: (element) => element.__mgInfiniteCleanup?.() }
export const MgInfiniteScroll = Object.assign(InfiniteScroll, { install(app: App) { app.component('MgInfiniteScroll', InfiniteScroll); app.directive('infinite-scroll', MgInfiniteScrollDirective) } })
export default MgInfiniteScroll
