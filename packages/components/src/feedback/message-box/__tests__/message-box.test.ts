import { afterEach, describe, expect, it } from 'vitest'
import { MgMessageBox } from '../index'

afterEach(() => MgMessageBox.close())

describe('MgMessageBox', () => {
  it('resolves confirm and rejects cancel actions', async () => {
    const confirmed = MgMessageBox.confirm('确认删除？', '提示')
    ;(document.querySelector('.mg-message-box__confirm') as HTMLButtonElement).click()
    await expect(confirmed).resolves.toBe('confirm')

    const cancelled = MgMessageBox.confirm('确认删除？', '提示')
    ;(document.querySelector('.mg-message-box__cancel') as HTMLButtonElement).click()
    await expect(cancelled).rejects.toBe('cancel')
  })

  it('returns prompt input values', async () => {
    const result = MgMessageBox.prompt('请输入名称', '输入')
    const input = document.querySelector('.mg-message-box__input') as HTMLInputElement
    input.value = 'MG Design'; input.dispatchEvent(new Event('input', { bubbles: true }))
    ;(document.querySelector('.mg-message-box__confirm') as HTMLButtonElement).click()
    await expect(result).resolves.toEqual({ value: 'MG Design', action: 'confirm' })
  })
})
