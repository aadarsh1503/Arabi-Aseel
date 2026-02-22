import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  // server: {
  //   proxy: {
  //     // Proxy for main server routes (port 5000)
  //     '/api/admin': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api/public': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api/auth': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api/chefs': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     // Proxy for secondary server routes (port 5001)
  //     '/api/marketing': {
  //       target: 'http://localhost:5001',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api/registration': {
  //       target: 'http://localhost:5001',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api/database': {
  //       target: 'http://localhost:5001',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api/settings': {
  //       target: 'http://localhost:5001',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
