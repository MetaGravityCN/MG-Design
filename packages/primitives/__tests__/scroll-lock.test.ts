import { afterEach, describe, expect, it } from 'vitest'
import { isDocumentScrollLocked, lockDocumentScroll } from '../src'

describe('document scroll lock', () => {
  afterEach(() => { document.body.style.cssText = '' })

  it('is reference counted and restores original styles', () => {
    document.body.style.overflow = 'auto'
    const releaseFirst = lockDocumentScroll(document)
    const releaseSecond = lockDocumentScroll(document)
    expect(document.body.style.overflow).toBe('hidden')
    expect(isDocumentScrollLocked(document)).toBe(true)
    releaseFirst()
    expect(document.body.style.overflow).toBe('hidden')
    releaseSecond()
    expect(document.body.style.overflow).toBe('auto')
    expect(isDocumentScrollLocked(document)).toBe(false)
  })
})
