import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.css',
      name: 'MgDesignTheme',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'index.css',
      },
    },
  },
})
