import { createApp, h, type App, type CSSProperties } from 'vue'
import NotificationView from './notification.vue'

export type NotificationType = 'success' | 'warning' | 'info' | 'error' | ''
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export interface NotificationOptions { title?: string; message?: string; type?: NotificationType; position?: NotificationPosition; duration?: number; showClose?: boolean; offset?: number; onClose?: () => void; onClick?: () => void }
export interface NotificationHandle { close: () => void }
type NotificationService = { (options: NotificationOptions | string): NotificationHandle; success(options: NotificationOptions | string): NotificationHandle; warning(options: NotificationOptions | string): NotificationHandle; info(options: NotificationOptions | string): NotificationHandle; error(options: NotificationOptions | string): NotificationHandle; closeAll(): void; install(app: App): void }
const instances: Array<{ position: NotificationPosition; height: number; close: () => void }> = []
function open(input: NotificationOptions | string, forcedType?: NotificationType): NotificationHandle {
  if (typeof document === 'undefined') return { close: () => {} }
  const options = typeof input === 'string' ? { message: input } : input; const position = options.position || 'top-right'; const offset = options.offset ?? 16
  const host = document.createElement('div'); document.body.appendChild(host); let exposed: { close: () => void } | undefined
  const same = instances.filter((item) => item.position === position); const distance = offset + same.reduce((sum, item) => sum + item.height + 16, 0)
  const vertical = position.startsWith('top') ? { top: `${distance}px` } : { bottom: `${distance}px` }; const horizontal = position.endsWith('right') ? { right: '16px' } : { left: '16px' }; const style: CSSProperties = { ...vertical, ...horizontal }
  const cleanup = () => { const index = instances.findIndex((item) => item.close === close); if (index >= 0) instances.splice(index, 1); app.unmount(); host.remove() }
  const app = createApp({ render: () => h(NotificationView, { ...options, type: forcedType || options.type, position, style, onDestroy: cleanup, ref: (value) => { exposed = value as unknown as { close: () => void } } }) })
  app.mount(host); const close = () => exposed?.close(); const element = host.querySelector('.mg-notification'); instances.push({ position, height: element?.getBoundingClientRect().height || 80, close }); return { close }
}
const service = ((options: NotificationOptions | string) => open(options)) as NotificationService
for (const type of ['success', 'warning', 'info', 'error'] as const) service[type] = (options) => open(options, type)
service.closeAll = () => [...instances].forEach((instance) => instance.close())
service.install = () => {}
export const MgNotification = service
export default MgNotification
