import { createApp, h, type App } from 'vue'
import MessageBoxView from './message-box.vue'

export type MessageBoxAction = 'confirm' | 'cancel' | 'close'
export interface MessageBoxOptions {
  title?: string; message?: string; type?: 'success' | 'warning' | 'info' | 'error'; showCancelButton?: boolean; showConfirmButton?: boolean; showClose?: boolean; closeOnClickModal?: boolean; closeOnPressEscape?: boolean; confirmButtonText?: string; cancelButtonText?: string; showInput?: boolean; inputValue?: string; inputPlaceholder?: string; inputType?: string; inputPattern?: RegExp; inputValidator?: (value: string) => boolean | string; inputErrorMessage?: string; callback?: (action: MessageBoxAction) => void
}
type PromptResult = { value: string; action: 'confirm' }
type MessageBoxService = {
  (options: MessageBoxOptions | string): Promise<MessageBoxAction>
  alert(message: string, title?: string, options?: MessageBoxOptions): Promise<'confirm'>
  confirm(message: string, title?: string, options?: MessageBoxOptions): Promise<'confirm'>
  prompt(message: string, title?: string, options?: MessageBoxOptions): Promise<PromptResult>
  close(): void
  install(app: App): void
}
let closeCurrent: (() => void) | undefined
function open(options: MessageBoxOptions): Promise<MessageBoxAction | PromptResult> {
  if (typeof document === 'undefined') return Promise.reject('close')
  closeCurrent?.(); const host = document.createElement('div'); document.body.appendChild(host)
  return new Promise((resolve, reject) => {
    const cleanup = () => { app.unmount(); host.remove(); if (closeCurrent === cleanup) closeCurrent = undefined }
    const action = (value: MessageBoxAction, input?: string) => { options.callback?.(value); cleanup(); if (value === 'confirm') resolve(options.showInput ? { value: input || '', action: 'confirm' } : 'confirm'); else reject(value) }
    const app = createApp({ render: () => h(MessageBoxView, { ...options, onAction: action }) })
    app.mount(host); closeCurrent = () => action('close')
  })
}
const service = ((options: MessageBoxOptions | string) => open(typeof options === 'string' ? { message: options } : options)) as MessageBoxService
service.alert = (message, title = '提示', options = {}) => open({ ...options, message, title, showCancelButton: false }) as Promise<'confirm'>
service.confirm = (message, title = '提示', options = {}) => open({ ...options, message, title, showCancelButton: true }) as Promise<'confirm'>
service.prompt = (message, title = '提示', options = {}) => open({ ...options, message, title, showInput: true, showCancelButton: true }) as Promise<PromptResult>
service.close = () => closeCurrent?.()
service.install = () => {}
export const MgMessageBox = service
export default MgMessageBox
