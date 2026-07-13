import type { InjectionKey, Slot } from 'vue'

export interface CarouselItemConfig { id: string; name?: string | number; label?: string; slot?: Slot }
export interface CarouselContext { register: (item: CarouselItemConfig) => void; unregister: (id: string) => void }
export const carouselContextKey: InjectionKey<CarouselContext> = Symbol('mg-carousel')
