# @mg-design/components

Vue 3 components and directives for MG Design.

```bash
pnpm add vue @mg-design/components @mg-design/theme
```

```ts
import { createApp } from 'vue'
import MgDesign from '@mg-design/components'
import '@mg-design/theme'
import '@mg-design/components/dist/components.css'

createApp(App).use(MgDesign).mount('#app')
```

Individual components and directives are also exported:

```ts
import { MgButton, MgInput, vLoading } from '@mg-design/components'
```

Source and issue tracking: [MetaGravityCN/MG-Design](https://github.com/MetaGravityCN/MG-Design).
