import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { MgAutocomplete } from '../index'

describe('MgAutocomplete', () => {
  it('fetches and selects suggestions', async () => {
    vi.useFakeTimers()
    const fetchSuggestions = vi.fn((_query: string, callback: (items: Array<{ value: string }>) => void) => callback([{ value: 'Vue' }, { value: 'Vite' }]))
    const wrapper = mount(MgAutocomplete, { props: { modelValue: '', fetchSuggestions, debounce: 10 } })
    await wrapper.find('input').setValue('v'); await vi.advanceTimersByTimeAsync(10)
    expect(fetchSuggestions).toHaveBeenCalledWith('v', expect.any(Function))
    await wrapper.findAll('.mg-autocomplete__item')[0].trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Vue'])
    vi.useRealTimers()
  })
})
