import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    outDir: 'docs',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
