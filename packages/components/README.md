# @metagravity_cn/mg-design

Vue 3 components and directives for MG Design.

```bash
pnpm add vue @metagravity_cn/mg-design @metagravity_cn/theme
```

```ts
import { createApp } from 'vue'
import MgDesign from '@metagravity_cn/mg-design'
import '@metagravity_cn/theme'
import '@metagravity_cn/mg-design/style.css'

createApp(App).use(MgDesign).mount('#app')
```

Individual components and directives are also exported:

```ts
import { MgButton, MgInput, vLoading } from '@metagravity_cn/mg-design'
```

Source and issue tracking: [MetaGravityCN/MG-Design](https://github.com/MetaGravityCN/MG-Design).
