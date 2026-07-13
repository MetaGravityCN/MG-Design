# MG Design

MG Design is an independent Vue 3 design system and component library for enterprise applications. The repository contains reusable components, design tokens, primitives, icons, and shared utilities.

## Packages

| Package | Purpose |
| --- | --- |
| `@mg-design/components` | Vue 3 components and directives |
| `@mg-design/theme` | Design tokens and shared theme styles |
| `@mg-design/icons` | Icon assets and Vue icon components |
| `@mg-design/primitives` | Framework-level behavior primitives |
| `@mg-design/utils` | Shared utilities |
| `@mg-design/business` | Higher-level business components |

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
import MgDesign from '@mg-design/components'
import '@mg-design/theme'

createApp(App).use(MgDesign).mount('#app')
```

Components can also be imported individually:

```ts
import { MgButton, MgInput, vLoading } from '@mg-design/components'
```

## Repository layout

```text
packages/     Publishable library packages
scripts/      Repository checks and maintenance scripts
```

## License

[MIT](./LICENSE)
