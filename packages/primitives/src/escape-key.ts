import { onBeforeUnmount, onMounted, toValue, type MaybeRefOrGetter } from 'vue'

export function useEscapeKey(handler: (event: KeyboardEvent) => void, active: MaybeRefOrGetter<boolean> = true) {
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && toValue(active)) handler(event)
  }
  onMounted(() => document.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
