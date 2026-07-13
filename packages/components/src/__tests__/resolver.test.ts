import { describe, expect, it } from 'vitest'
import { MgResolver } from '../resolver'

describe('MgResolver', () => {
  it('resolves MG component names to named package exports', () => {
    expect(MgResolver().resolve('MgButton')).toEqual({ name: 'MgButton', from: '@metagravity_cn/mg-design' })
  })

  it('ignores names outside the MG component namespace', () => {
    expect(MgResolver().resolve('Button')).toBeUndefined()
    expect(MgResolver().resolve('Mgbutton')).toBeUndefined()
  })
})
