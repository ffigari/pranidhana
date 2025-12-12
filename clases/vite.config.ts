import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  root: 'src/client',
  envDir: path.resolve(__dirname, '.'), // Look for .env files in project root
  server: {
    middlewareMode: false,
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: '../../dist/client', // relative to src/client
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'src/client/entrypoints/index.html'),
        'dojo-signup-login-request': path.resolve(__dirname, 'src/client/entrypoints/dojo-signup-login-request.html'),
        'dojo-signup': path.resolve(__dirname, 'src/client/entrypoints/dojo-signup.html'),
        'teacher-signup-login-request': path.resolve(__dirname, 'src/client/entrypoints/teacher-signup-login-request.html'),
        'teacher-signup': path.resolve(__dirname, 'src/client/entrypoints/teacher-signup.html'),
        'classes': path.resolve(__dirname, 'src/client/entrypoints/classes.html'),
        'my-classes': path.resolve(__dirname, 'src/client/entrypoints/my-classes.html'),
        'login': path.resolve(__dirname, 'src/client/entrypoints/login.html'),
        'dojos': path.resolve(__dirname, 'src/client/entrypoints/dojos.html'),
        'dojo': path.resolve(__dirname, 'src/client/entrypoints/dojo.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  plugins: [
    react(),
    {
      name: 'rewrite-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Map clean URLs to entrypoints HTML files
          if (req.url === '/') {
            req.url = '/entrypoints/index.html'
          } else if (req.url === '/dojo-signup') {
            req.url = '/entrypoints/dojo-signup.html'
          } else if (req.url === '/dojo-signup-login-request') {
            req.url = '/entrypoints/dojo-signup-login-request.html'
          } else if (req.url === '/teacher-signup') {
            req.url = '/entrypoints/teacher-signup.html'
          } else if (req.url === '/teacher-signup-login-request') {
            req.url = '/entrypoints/teacher-signup-login-request.html'
          } else if (req.url === '/login') {
            req.url = '/entrypoints/login.html'
          } else if (req.url === '/classes') {
            req.url = '/entrypoints/classes.html'
          } else if (req.url === '/my-classes') {
            req.url = '/entrypoints/my-classes.html'
          } else if (req.url === '/dojos') {
            req.url = '/entrypoints/dojos.html'
          }
          next()
        })
      },
    },
  ],
})
