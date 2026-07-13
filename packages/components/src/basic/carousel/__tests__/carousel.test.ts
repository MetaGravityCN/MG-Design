import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MgCarousel } from '../index'
import { MgCarouselItem } from '../../carousel-item'

afterEach(() => vi.useRealTimers())

function mountCarousel(autoplay = false) {
  return mount({
    components: { MgCarousel, MgCarouselItem },
    template: `<MgCarousel height="120px" :autoplay="${autoplay}" :interval="500"><MgCarouselItem name="a">第一张</MgCarouselItem><MgCarouselItem name="b">第二张</MgCarouselItem></MgCarousel>`,
  })
}

describe('MgCarousel', () => {
  it('registers slides and switches with controls', async () => {
    const wrapper = mountCarousel()
    await nextTick()
    expect(wrapper.text()).toContain('第一张')
    await wrapper.find('[aria-label="下一张"]').trigger('click')
    expect(wrapper.text()).toContain('第二张')
    expect(wrapper.findComponent(MgCarousel).emitted('change')).toEqual([[1, 0]])
  })

  it('supports autoplay', async () => {
    vi.useFakeTimers()
    const wrapper = mountCarousel(true)
    await nextTick()
    await vi.advanceTimersByTimeAsync(600)
    expect(wrapper.text()).toContain('第二张')
  })
})
