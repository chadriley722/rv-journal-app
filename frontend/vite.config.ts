import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    // WARNING: Adding unsafe-eval is a security risk. 
    // This is for development purposes only and should be reviewed for production.
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'; base-uri 'self'; require-trusted-types-for 'script';",
    },
  },
})
