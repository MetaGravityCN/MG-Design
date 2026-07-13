<p align="center">
  <img src=".github/assets/mg-design-logo.svg" alt="MG Design" width="360">
</p>

<p align="center">
  <strong>English</strong> · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://design.meta-gravity.com"><strong>Component Site</strong></a> ·
  <a href="https://github.com/MetaGravityCN/MG-Design">GitHub</a> ·
  <a href="https://www.npmjs.com/package/@metagravity_cn/mg-design">npm</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@metagravity_cn/mg-design"><img src="https://img.shields.io/npm/v/%40metagravity_cn%2Fmg-design?color=327CFF&label=npm" alt="npm version"></a>
  <a href="https://github.com/MetaGravityCN/MG-Design/actions/workflows/ci.yml"><img src="https://github.com/MetaGravityCN/MG-Design/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="https://github.com/MetaGravityCN/MG-Design/releases"><img src="https://img.shields.io/github/v/release/MetaGravityCN/MG-Design?display_name=tag&color=101A2B" alt="GitHub release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/MetaGravityCN/MG-Design?color=327CFF" alt="License"></a>
</p>

# MG Design

MG Design is an independent Vue 3 design system for enterprise applications. It combines stable components, unified design tokens, accessible interaction primitives, icons, and utilities in a modular package family.

Explore components, design guidelines, and usage examples at **[design.meta-gravity.com](https://design.meta-gravity.com)**.

## Features

- 60+ Vue 3 components with TypeScript declarations
- Independent implementation without Element runtime dependencies
- Unified theme tokens and component styles
- Accessibility-oriented overlays, focus management, and form primitives
- Full imports, individual imports, and an unplugin resolver
- Tested package boundaries and publishable ESM/CJS builds

## Installation

```bash
pnpm add vue @metagravity_cn/mg-design @metagravity_cn/theme
```

If your package manager uses a mirror that has not synchronized the latest release yet, install directly from the official npm registry:

```bash
pnpm add vue @metagravity_cn/mg-design @metagravity_cn/theme --registry=https://registry.npmjs.org/
```

## Quick start

```ts
import { createApp } from 'vue'
import App from './App.vue'
import MgDesign from '@metagravity_cn/mg-design'
import '@metagravity_cn/theme'
import '@metagravity_cn/mg-design/style.css'

createApp(App).use(MgDesign).mount('#app')
```

Components and directives can also be imported individually:

```ts
import { MgButton, MgInput, vLoading } from '@metagravity_cn/mg-design'
```

## Packages

| Package | Purpose |
| --- | --- |
| [`@metagravity_cn/mg-design`](https://www.npmjs.com/package/@metagravity_cn/mg-design) | Vue components, directives, and resolver |
| [`@metagravity_cn/theme`](https://www.npmjs.com/package/@metagravity_cn/theme) | Design tokens and shared theme styles |
| [`@metagravity_cn/icons`](https://www.npmjs.com/package/@metagravity_cn/icons) | Vue icon components |
| [`@metagravity_cn/primitives`](https://www.npmjs.com/package/@metagravity_cn/primitives) | Accessible interaction primitives |
| [`@metagravity_cn/utils`](https://www.npmjs.com/package/@metagravity_cn/utils) | Shared TypeScript utilities |

## Development

Requirements: Node.js 18+ and pnpm 11.

```bash
pnpm install
pnpm test
pnpm build:all
pnpm check:element-boundary
```

The documentation site and playground are maintained locally and are not included in the published npm packages.

## License

[MIT](LICENSE) © MetaGravityCN
