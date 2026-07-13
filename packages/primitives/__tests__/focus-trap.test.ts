import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useFocusTrap } from '../src'

describe('focus trap', () => {
  it('focuses the first control, wraps tab focus and handles escape', async () => {
    const onEscape = vi.fn()
    const Host = defineComponent({
      setup() {
        const root = ref<HTMLElement>()
        useFocusTrap(root, { onEscape })
        return () => h('div', { ref: root, tabindex: -1 }, [
          h('button', { id: 'first' }, 'First'),
          h('button', { id: 'last' }, 'Last'),
        ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(document.activeElement?.id).toBe('first')
    wrapper.get('#last').element.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement?.id).toBe('first')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onEscape).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
