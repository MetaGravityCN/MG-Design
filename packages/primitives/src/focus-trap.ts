import { nextTick, onBeforeUnmount, onMounted, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

const focusableSelector = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]',
].join(',')

export interface FocusTrapOptions {
  active?: MaybeRefOrGetter<boolean>
  initialFocus?: string | HTMLElement | (() => HTMLElement | null)
  returnFocus?: boolean
  escapeDeactivates?: boolean
  onEscape?: (event: KeyboardEvent) => void
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) =>
    !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  )
}

export function useFocusTrap(container: Ref<HTMLElement | null | undefined>, options: FocusTrapOptions = {}) {
  const active = options.active ?? true
  let previouslyFocused: HTMLElement | null = null
  let listening = false

  const resolveInitialFocus = () => {
    const currentContainer = container.value
    if (!currentContainer) return null
    if (typeof options.initialFocus === 'string') return container.value?.querySelector<HTMLElement>(options.initialFocus) ?? null
    if (typeof options.initialFocus === 'function') return options.initialFocus()
    if (options.initialFocus instanceof HTMLElement) return options.initialFocus
    return getFocusableElements(currentContainer)[0] ?? currentContainer
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (!toValue(active) || !container.value) return
    if (event.key === 'Escape' && options.escapeDeactivates !== false) {
      options.onEscape?.(event)
      return
    }
    if (event.key !== 'Tab') return
    const focusable = getFocusableElements(container.value)
    if (focusable.length === 0) {
      event.preventDefault()
      container.value.focus()
      return
    }
    const first = focusable[0]
    const last = focusable.at(-1) as HTMLElement
    if (event.shiftKey && (document.activeElement === first || !container.value.contains(document.activeElement))) {
      event.preventDefault(); last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus()
    }
  }

  async function activate() {
    if (!container.value || listening) return
    listening = true
    previouslyFocused = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    if (!listening || !container.value || !toValue(active)) return
    resolveInitialFocus()?.focus()
  }

  function deactivate() {
    if (!listening) return
    listening = false
    document.removeEventListener('keydown', onKeydown)
    if (options.returnFocus !== false) previouslyFocused?.focus()
    previouslyFocused = null
  }

  onMounted(() => { if (toValue(active)) void activate() })
  watch(() => toValue(active), (value) => value ? void activate() : deactivate(), { flush: 'post' })
  onBeforeUnmount(deactivate)
  return { activate, deactivate }
}
