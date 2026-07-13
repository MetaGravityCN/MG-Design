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
      external: ['vue', '@mg-design/theme', '@mg-design/icons', '@mg-design/utils', '@mg-design/primitives'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@mg-design/primitives': 'MgDesignPrimitives',
        },
      },
    },
  },
})
