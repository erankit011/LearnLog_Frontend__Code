import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    // Proxy is only used in development
    // In production, axios uses VITE_API_URL directly
    proxy: {
      '/api': {
        target: 'http://localhost:8585',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Don't rewrite the path
      }
    }
  },
  build: {
    // Optimize build for production
    minify: 'terser',
    sourcemap: false, // Disable sourcemaps in production for security
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['react-toastify'],
        }
      }
    }
  }
})
