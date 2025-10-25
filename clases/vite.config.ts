import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'src/client',
  envDir: path.resolve(__dirname, '.'), // Look for .env files in project root
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
