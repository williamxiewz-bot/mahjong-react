import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    minify: 'esbuild',
    outDir: 'docs',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'react-dom'
            }
            if (id.includes('react')) {
              return 'react'
            }
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [],
  },
})
