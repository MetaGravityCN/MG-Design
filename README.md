# MG Design

MG Design is an independent Vue 3 design system and component library for enterprise applications. The repository contains reusable components, design tokens, primitives, icons, and shared utilities.

## Packages

| Package | Purpose |
| --- | --- |
| `@metagravity_cn/mg-design` | Vue 3 components and directives |
| `@metagravity_cn/theme` | Design tokens and shared theme styles |
| `@metagravity_cn/icons` | Icon assets and Vue icon components |
| `@metagravity_cn/primitives` | Framework-level behavior primitives |
| `@metagravity_cn/utils` | Shared utilities |
| `@metagravity_cn/business` | Higher-level business components |

## Requirements

- Node.js 18 or later
- pnpm 11

## Development

```bash
pnpm install
pnpm test
```

## Quality checks

```bash
pnpm test
pnpm build:all
pnpm check:element-boundary
```

## Using the component library

```ts
import { createApp } from 'vue'
import MgDesign from '@metagravity_cn/mg-design'
import '@metagravity_cn/theme'
import '@metagravity_cn/mg-design/style.css'

createApp(App).use(MgDesign).mount('#app')
```

Components can also be imported individually:

```ts
import { MgButton, MgInput, vLoading } from '@metagravity_cn/mg-design'
```

## Repository layout

```text
packages/     Publishable library packages
scripts/      Repository checks and maintenance scripts
```

## License

[MIT](./LICENSE)
