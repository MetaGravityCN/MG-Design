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
      '@mg-design/components': resolve(__dirname, 'packages/components/src/index.ts'),
      '@mg-design/icons': resolve(__dirname, 'packages/icons/src/index.ts'),
      '@mg-design/utils': resolve(__dirname, 'packages/utils/src/index.ts'),
      '@mg-design/primitives': resolve(__dirname, 'packages/primitives/src/index.ts'),
      '@mg-design/theme': resolve(__dirname, 'packages/theme/src/index.css'),
    },
  },
})
