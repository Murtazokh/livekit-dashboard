import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Listen on all network interfaces for Docker
    proxy: {
      '/api': {
        // Use backend service name in Docker, fallback to localhost for local development
        target: process.env.VITE_API_URL || 'http://backend:3001',
        changeOrigin: true,
      },
    },
  },
})
