import { describe, expect, it, vi } from 'vitest'
import { createOverlayManager } from '../src'

describe('overlay manager', () => {
  it('assigns increasing layers and tracks the topmost overlay', () => {
    const manager = createOverlayManager(1000)
    const first = manager.open({ type: 'dialog' })
    const second = manager.open({ type: 'popover' })
    expect(first.record.zIndex).toBe(1001)
    expect(second.record.zIndex).toBe(1002)
    expect(first.isTopmost.value).toBe(false)
    expect(second.isTopmost.value).toBe(true)
    second.release()
    expect(first.isTopmost.value).toBe(true)
  })

  it('routes close requests to the topmost overlay', () => {
    const manager = createOverlayManager()
    const close = vi.fn()
    manager.open({ type: 'drawer', close })
    manager.closeTop('escape')
    expect(close).toHaveBeenCalledWith('escape')
  })
})
