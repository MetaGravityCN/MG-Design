import type { App, Component } from 'vue'

export const withInstall = <T extends Component>(component: T, installName?: string) => {
  const comp = component as T & { install: (app: App) => void }
  comp.install = (app: App) => {
    const name = installName || comp.name || 'MgComponent'
    app.component(name, comp)
  }
  return comp
}
