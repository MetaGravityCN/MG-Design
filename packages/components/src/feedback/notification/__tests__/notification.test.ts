import { afterEach, describe, expect, it, vi } from 'vitest'
import { MgNotification } from '../index'

afterEach(() => { MgNotification.closeAll(); vi.useRealTimers() })

describe('MgNotification', () => {
  it('creates typed positioned notifications and closes them', async () => {
    vi.useFakeTimers()
    const handle = MgNotification.success({ title: '完成', message: '保存成功', position: 'bottom-left', duration: 0 })
    const element = document.querySelector('.mg-notification') as HTMLElement
    expect(element.textContent).toContain('保存成功')
    expect(element.classList).toContain('is-success')
    expect(element.classList).toContain('is-bottom-left')
    handle.close()
    await vi.advanceTimersByTimeAsync(250)
    expect(document.querySelector('.mg-notification')).toBeNull()
  })
})
