import { computed, readonly, shallowReactive, type ComputedRef } from 'vue'

export type OverlayType = 'dialog' | 'drawer' | 'message-box' | 'popover' | 'tooltip' | 'dropdown' | 'custom'

export interface OverlayRecord {
  id: string
  type: OverlayType
  zIndex: number
  close?: (reason: 'escape' | 'programmatic') => void
}

export interface OverlayHandle {
  record: Readonly<OverlayRecord>
  isTopmost: ComputedRef<boolean>
  release: () => void
}

export function createOverlayManager(baseZIndex = 2000) {
  const stack = shallowReactive<OverlayRecord[]>([])
  let sequence = 0
  let zIndex = baseZIndex

  const nextZIndex = () => ++zIndex

  function open(options: Partial<Omit<OverlayRecord, 'id' | 'zIndex'>> & Pick<OverlayRecord, 'type'>): OverlayHandle {
    const record: OverlayRecord = {
      id: `mg-overlay-${++sequence}`,
      type: options.type,
      zIndex: nextZIndex(),
      close: options.close,
    }
    stack.push(record)
    let released = false
    const release = () => {
      if (released) return
      released = true
      const index = stack.findIndex((item) => item.id === record.id)
      if (index >= 0) stack.splice(index, 1)
    }
    return {
      record: readonly(record),
      isTopmost: computed(() => stack.at(-1)?.id === record.id),
      release,
    }
  }

  function closeTop(reason: 'escape' | 'programmatic' = 'programmatic') {
    const record = stack.at(-1)
    record?.close?.(reason)
  }

  return {
    stack: readonly(stack),
    nextZIndex,
    open,
    closeTop,
    isTopmost: (id: string) => stack.at(-1)?.id === id,
  }
}

export const overlayManager = createOverlayManager()
