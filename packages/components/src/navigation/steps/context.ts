import type { InjectionKey, Ref } from 'vue'

export type MgStepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success'
export interface MgStepsContext {
  active: Ref<number>
  direction: Ref<'horizontal' | 'vertical'>
  finishStatus: Ref<MgStepStatus>
  processStatus: Ref<MgStepStatus>
  simple: Ref<boolean>
  space: Ref<string | number>
  register: (id: symbol) => void
  unregister: (id: symbol) => void
  indexOf: (id: symbol) => number
}
export const mgStepsKey: InjectionKey<MgStepsContext> = Symbol('mg-steps')
