interface ScrollLockState {
  count: number
  overflow: string
  paddingRight: string
}

const locks = new Map<Document, ScrollLockState>()

export function lockDocumentScroll(target?: Document): () => void {
  const doc = target ?? (typeof document === 'undefined' ? undefined : document)
  if (!doc?.body) return () => undefined

  let state = locks.get(doc)
  if (!state) {
    const view = doc.defaultView
    const scrollbarWidth = view ? Math.max(0, view.innerWidth - doc.documentElement.clientWidth) : 0
    const currentPadding = view ? Number.parseFloat(view.getComputedStyle(doc.body).paddingRight) || 0 : 0
    state = {
      count: 0,
      overflow: doc.body.style.overflow,
      paddingRight: doc.body.style.paddingRight,
    }
    locks.set(doc, state)
    doc.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) doc.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
  state.count += 1

  let released = false
  return () => {
    if (released) return
    released = true
    const current = locks.get(doc)
    if (!current) return
    current.count -= 1
    if (current.count > 0) return
    doc.body.style.overflow = current.overflow
    doc.body.style.paddingRight = current.paddingRight
    locks.delete(doc)
  }
}

export function isDocumentScrollLocked(target?: Document) {
  const doc = target ?? (typeof document === 'undefined' ? undefined : document)
  return doc ? locks.has(doc) : false
}
