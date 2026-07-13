import { describe, expect, it, vi } from 'vitest'
import { computeFloatingPosition } from '../src/floating-position'

describe('computeFloatingPosition', () => {
  it('positions and flips a panel within the viewport', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)
    const reference = document.createElement('button')
    const floating = document.createElement('div')
    reference.getBoundingClientRect = () => ({ left: 100, right: 140, top: 4, bottom: 24, width: 40, height: 20, x: 100, y: 4, toJSON() {} })
    floating.getBoundingClientRect = () => ({ left: 0, right: 100, top: 0, bottom: 40, width: 100, height: 40, x: 0, y: 0, toJSON() {} })

    expect(computeFloatingPosition(reference, floating, { placement: 'top', offset: 8 })).toEqual({
      x: 70, y: 32, placement: 'bottom',
    })
  })
})
