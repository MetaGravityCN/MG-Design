import { useId } from 'vue'

let fallbackSequence = 0

export function useStableId(provided?: string, prefix = 'mg') {
  const vueId = useId()
  if (provided) return provided
  const normalized = vueId.replace(/[^a-zA-Z0-9_-]/g, '')
  return `${prefix}-${normalized || ++fallbackSequence}`
}
