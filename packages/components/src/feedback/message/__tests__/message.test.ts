import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { MgMessage } from '../index'

describe('MgMessage', () => {
  afterEach(() => { MgMessage.closeAll(); vi.runAllTimers(); vi.useRealTimers(); document.body.innerHTML = '' })
  it('creates typed messages and closes all instances', async () => {
    vi.useFakeTimers()
    MgMessage.success('Saved', { duration: 0, showClose: true })
    await nextTick()
    const message = document.querySelector<HTMLElement>('.mg-message')
    expect(message?.textContent).toContain('Saved')
    expect(message?.classList.contains('is-success')).toBe(true)
    MgMessage.closeAll()
    await nextTick(); vi.runAllTimers(); await nextTick()
    expect(document.querySelector('.mg-message')).toBeNull()
  })
})
