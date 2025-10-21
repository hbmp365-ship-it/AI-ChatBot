import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      '3000-irux7k3zdyt94tlddvkcn-de59bda9.sandbox.novita.ai',
      '.sandbox.novita.ai'
    ]
  }
})
