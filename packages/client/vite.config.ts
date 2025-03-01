import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'ws://localhost:8888',
        ws: true
      }
    }
  }
})
