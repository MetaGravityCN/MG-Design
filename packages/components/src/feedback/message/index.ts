import { createVNode, isVNode, nextTick, render, type Component, type VNode } from 'vue'
import MessageView, { type MgMessageType } from './message.vue'

export type MessageType = MgMessageType
export type MgMessageContent = string | VNode | (() => VNode)
export interface MgMessageOptions {
  message?: MgMessageContent
  type?: MessageType
  duration?: number
  showClose?: boolean
  center?: boolean
  plain?: boolean
  customClass?: string
  dangerouslyUseHTMLString?: boolean
  offset?: number
  appendTo?: string | HTMLElement
  grouping?: boolean
  onClose?: () => void
  icon?: Component
}
export interface MgMessageHandler { close: () => void }

interface MessageRecord {
  container: HTMLDivElement
  options: MgMessageOptions
  handler: MgMessageHandler
  height: number
  closed: boolean
}
const records: MessageRecord[] = []
let zIndex = 2000

function resolveTarget(target: MgMessageOptions['appendTo']) {
  if (target instanceof HTMLElement) return target
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? document.body
  return document.body
}
function reposition() {
  let top = 0
  for (const record of records) {
    top += record.options.offset ?? 20
    const element = record.container.querySelector<HTMLElement>('.mg-message')
    if (element) element.style.top = `${top}px`
    top += record.height
  }
}
function normalizeOptions(input: MgMessageOptions | MgMessageContent): MgMessageOptions {
  if (typeof input === 'string' || typeof input === 'function' || isVNode(input)) {
    return { message: input as MgMessageContent }
  }
  return { ...(input as MgMessageOptions) }
}
function createMessage(input: MgMessageOptions | MgMessageContent): MgMessageHandler {
  const options = normalizeOptions(input)
  if (typeof document === 'undefined') return { close: () => undefined }
  if (options.grouping && typeof options.message === 'string') {
    const existing = records.find((record) => record.options.message === options.message && record.options.type === options.type)
    if (existing) return existing.handler
  }
  const container = document.createElement('div')
  const record = {} as MessageRecord
  const destroy = () => {
    if (record.closed) return
    record.closed = true
    const index = records.indexOf(record)
    if (index >= 0) records.splice(index, 1)
    render(null, container); container.remove(); options.onClose?.(); reposition()
  }
  const vnode = createVNode(MessageView, {
    ...options,
    type: options.type ?? 'info',
    zIndex: ++zIndex,
    onDestroy: destroy,
  }, typeof options.message === 'string' || options.message == null ? undefined : {
    default: typeof options.message === 'function' ? options.message : () => options.message,
  })
  render(vnode, container)
  resolveTarget(options.appendTo).appendChild(container)
  const handler = { close: () => (vnode.component?.exposed?.close as (() => void) | undefined)?.() }
  Object.assign(record, { container, options, handler, height: 0, closed: false })
  records.push(record)
  void nextTick(() => {
    record.height = container.querySelector<HTMLElement>('.mg-message')?.offsetHeight ?? 44
    reposition()
  })
  return handler
}

export interface MgMessageFn {
  (options: MgMessageOptions | MgMessageContent): MgMessageHandler
  success: (message: MgMessageContent | MgMessageOptions, options?: Omit<MgMessageOptions, 'type' | 'message'>) => MgMessageHandler
  warning: (message: MgMessageContent | MgMessageOptions, options?: Omit<MgMessageOptions, 'type' | 'message'>) => MgMessageHandler
  info: (message: MgMessageContent | MgMessageOptions, options?: Omit<MgMessageOptions, 'type' | 'message'>) => MgMessageHandler
  error: (message: MgMessageContent | MgMessageOptions, options?: Omit<MgMessageOptions, 'type' | 'message'>) => MgMessageHandler
  closeAll: (type?: MessageType) => void
}
const MgMessage = createMessage as MgMessageFn
for (const type of ['success', 'warning', 'info', 'error'] as const) {
  MgMessage[type] = (message, options) => typeof message === 'object' && message && !isVNode(message)
    ? createMessage({ ...message as MgMessageOptions, type })
    : createMessage({ message: message as MgMessageContent, ...options, type })
}
MgMessage.closeAll = (type) => [...records].filter((record) => !type || record.options.type === type).forEach((record) => record.handler.close())

export { MgMessage }
export default MgMessage
