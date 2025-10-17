import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'src/client',
  base: '/shared-code-experiment/', // this should not be needed if whole app was in root
  build: {
    outDir: '../../dist/client', // relative to src/client
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  plugins: [react()],
})
