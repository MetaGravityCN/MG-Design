import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['src/**/__tests__/**', 'src/**/*.test.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        resolver: resolve(__dirname, 'src/resolver.ts'),
      },
      name: 'MgDesignComponents',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', '@metagravity_cn/theme', '@metagravity_cn/icons', '@metagravity_cn/utils', '@metagravity_cn/primitives'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@metagravity_cn/primitives': 'MgDesignPrimitives',
        },
      },
    },
  },
})
