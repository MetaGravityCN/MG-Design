import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['packages/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@metagravity_cn/mg-design': resolve(__dirname, 'packages/components/src/index.ts'),
      '@metagravity_cn/icons': resolve(__dirname, 'packages/icons/src/index.ts'),
      '@metagravity_cn/utils': resolve(__dirname, 'packages/utils/src/index.ts'),
      '@metagravity_cn/primitives': resolve(__dirname, 'packages/primitives/src/index.ts'),
      '@metagravity_cn/theme': resolve(__dirname, 'packages/theme/src/index.css'),
    },
  },
})
