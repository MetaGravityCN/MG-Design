export interface MgLoadingMaskOptions {
  text?: string
  background?: string
  customClass?: string
  spinner?: string
  svg?: string
  svgViewBox?: string
  fullscreen?: boolean
  zIndex?: number
}

export function createLoadingMask(options: MgLoadingMaskOptions = {}) {
  const mask = document.createElement('div')
  mask.className = ['mg-loading-mask', options.fullscreen && 'is-fullscreen', options.customClass].filter(Boolean).join(' ')
  mask.setAttribute('role', 'status')
  mask.setAttribute('aria-live', 'polite')
  if (options.background) mask.style.background = options.background
  if (options.zIndex != null) mask.style.zIndex = String(options.zIndex)
  const content = document.createElement('div')
  content.className = 'mg-loading-content'
  const spinner = document.createElement('div')
  spinner.className = ['mg-loading-spinner', options.spinner].filter(Boolean).join(' ')
  spinner.setAttribute('aria-hidden', 'true')
  if (options.svg) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', options.svgViewBox ?? '0 0 50 50')
    svg.innerHTML = options.svg
    spinner.replaceChildren(svg)
  }
  content.appendChild(spinner)
  const text = document.createElement('p')
  text.className = 'mg-loading-text'
  text.textContent = options.text ?? ''
  if (options.text) content.appendChild(text)
  mask.appendChild(content)
  return {
    element: mask,
    setText(value: string) {
      text.textContent = value
      if (value && !text.isConnected) content.appendChild(text)
      if (!value) text.remove()
    },
  }
}
