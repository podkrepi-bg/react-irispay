import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'types/index': 'src/types/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
