export interface MgResolverOptions {
  /** Package name used by generated imports. */
  importStyle?: false
}

export interface MgComponentResolveResult {
  name: string
  from: string
}

/**
 * Resolve `MgXxx` template tags to named exports from the component package.
 * The shape intentionally follows the resolver contract used by
 * unplugin-vue-components without adding it as a runtime dependency.
 */
export function MgResolver(_options: MgResolverOptions = {}) {
  return {
    type: 'component' as const,
    resolve(name: string): MgComponentResolveResult | undefined {
      if (!/^Mg[A-Z][A-Za-z0-9]*$/.test(name)) return undefined
      return { name, from: '@metagravity_cn/mg-design' }
    },
  }
}

export default MgResolver
