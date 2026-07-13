<p align="center">
  <img src=".github/assets/mg-design-logo.svg" alt="MG Design" width="360">
</p>

<p align="center">
  <a href="README.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  <a href="https://design.meta-gravity.com"><strong>组件站</strong></a> ·
  <a href="https://github.com/MetaGravityCN/MG-Design">GitHub</a> ·
  <a href="https://www.npmjs.com/package/@metagravity_cn/mg-design">npm</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@metagravity_cn/mg-design"><img src="https://img.shields.io/npm/v/%40metagravity_cn%2Fmg-design?color=327CFF&label=npm" alt="npm 版本"></a>
  <a href="https://github.com/MetaGravityCN/MG-Design/actions/workflows/ci.yml"><img src="https://github.com/MetaGravityCN/MG-Design/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="https://github.com/MetaGravityCN/MG-Design/releases"><img src="https://img.shields.io/github/v/release/MetaGravityCN/MG-Design?display_name=tag&color=101A2B" alt="GitHub Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/MetaGravityCN/MG-Design?color=327CFF" alt="许可证"></a>
</p>

# MG Design

MG Design 是面向企业级应用的独立 Vue 3 设计系统。它以模块化包族提供稳定组件、统一设计令牌、无障碍交互原语、图标与工具函数。

访问 **[design.meta-gravity.com](https://design.meta-gravity.com)** 查看组件、设计规范与使用示例。

## 特性

- 60+ 个 Vue 3 组件，提供完整 TypeScript 类型声明
- 独立实现，运行时不依赖 Element
- 统一的主题令牌与组件样式
- 面向无障碍的浮层、焦点管理与表单原语
- 支持完整引入、按需引入与 unplugin 解析器
- 经过包边界检查与测试的 ESM/CJS 构建产物

## 安装

```bash
pnpm add vue @metagravity_cn/mg-design @metagravity_cn/theme
```

如果你使用的 npm 镜像尚未同步最新版本，可以直接使用 npm 官方 Registry：

```bash
pnpm add vue @metagravity_cn/mg-design @metagravity_cn/theme --registry=https://registry.npmjs.org/
```

## 快速开始

```ts
import { createApp } from 'vue'
import App from './App.vue'
import MgDesign from '@metagravity_cn/mg-design'
import '@metagravity_cn/theme'
import '@metagravity_cn/mg-design/style.css'

createApp(App).use(MgDesign).mount('#app')
```

也可以按需导入组件和指令：

```ts
import { MgButton, MgInput, vLoading } from '@metagravity_cn/mg-design'
```

## 包说明

| 包 | 用途 |
| --- | --- |
| [`@metagravity_cn/mg-design`](https://www.npmjs.com/package/@metagravity_cn/mg-design) | Vue 组件、指令与解析器 |
| [`@metagravity_cn/theme`](https://www.npmjs.com/package/@metagravity_cn/theme) | 设计令牌与公共主题样式 |
| [`@metagravity_cn/icons`](https://www.npmjs.com/package/@metagravity_cn/icons) | Vue 图标组件 |
| [`@metagravity_cn/primitives`](https://www.npmjs.com/package/@metagravity_cn/primitives) | 无障碍交互原语 |
| [`@metagravity_cn/utils`](https://www.npmjs.com/package/@metagravity_cn/utils) | TypeScript 公共工具函数 |

## 本地开发

环境要求：Node.js 18+、pnpm 11。

```bash
pnpm install
pnpm test
pnpm build:all
pnpm check:element-boundary
```

文档站与 Playground 仅在本地维护，不包含在发布到 npm 的包中。

## 许可证

[MIT](LICENSE) © MetaGravityCN
