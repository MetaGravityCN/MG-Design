export type FloatingSide = 'top' | 'bottom' | 'left' | 'right'
export type FloatingAlignment = 'start' | 'end'
export type FloatingPlacement = FloatingSide | `${FloatingSide}-${FloatingAlignment}`

export interface FloatingPositionOptions {
  placement?: FloatingPlacement
  offset?: number
  viewportPadding?: number
}

export interface FloatingPosition {
  x: number
  y: number
  placement: FloatingPlacement
}

const oppositeSide: Record<FloatingSide, FloatingSide> = {
  top: 'bottom', bottom: 'top', left: 'right', right: 'left',
}

function splitPlacement(placement: FloatingPlacement): [FloatingSide, FloatingAlignment | undefined] {
  return placement.split('-') as [FloatingSide, FloatingAlignment | undefined]
}

function coordinates(reference: DOMRect, floating: DOMRect, placement: FloatingPlacement, offset: number) {
  const [side, alignment] = splitPlacement(placement)
  let x = reference.left + (reference.width - floating.width) / 2
  let y = reference.top + (reference.height - floating.height) / 2

  if (side === 'top') y = reference.top - floating.height - offset
  if (side === 'bottom') y = reference.bottom + offset
  if (side === 'left') x = reference.left - floating.width - offset
  if (side === 'right') x = reference.right + offset

  if (side === 'top' || side === 'bottom') {
    if (alignment === 'start') x = reference.left
    if (alignment === 'end') x = reference.right - floating.width
  } else {
    if (alignment === 'start') y = reference.top
    if (alignment === 'end') y = reference.bottom - floating.height
  }
  return { x, y }
}

function overflowsMainAxis(position: { x: number; y: number }, floating: DOMRect, side: FloatingSide, padding: number) {
  if (side === 'top') return position.y < padding
  if (side === 'bottom') return position.y + floating.height > window.innerHeight - padding
  if (side === 'left') return position.x < padding
  return position.x + floating.width > window.innerWidth - padding
}

export function computeFloatingPosition(
  reference: Element,
  floating: HTMLElement,
  options: FloatingPositionOptions = {},
): FloatingPosition {
  const offset = options.offset ?? 8
  const padding = options.viewportPadding ?? 8
  let placement = options.placement ?? 'bottom'
  const referenceRect = reference.getBoundingClientRect()
  const floatingRect = floating.getBoundingClientRect()
  let position = coordinates(referenceRect, floatingRect, placement, offset)
  const [side, alignment] = splitPlacement(placement)

  if (overflowsMainAxis(position, floatingRect, side, padding)) {
    placement = `${oppositeSide[side]}${alignment ? `-${alignment}` : ''}` as FloatingPlacement
    position = coordinates(referenceRect, floatingRect, placement, offset)
  }

  return {
    x: Math.min(Math.max(position.x, padding), Math.max(padding, window.innerWidth - floatingRect.width - padding)),
    y: Math.min(Math.max(position.y, padding), Math.max(padding, window.innerHeight - floatingRect.height - padding)),
    placement,
  }
}

export function autoUpdateFloating(reference: Element, floating: HTMLElement, update: () => void) {
  const onUpdate = () => update()
  window.addEventListener('resize', onUpdate)
  window.addEventListener('scroll', onUpdate, true)
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(onUpdate)
  observer?.observe(reference)
  observer?.observe(floating)
  update()
  return () => {
    window.removeEventListener('resize', onUpdate)
    window.removeEventListener('scroll', onUpdate, true)
    observer?.disconnect()
  }
}
