import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

const backendRoutes = [
  '/api', '/customers', '/items', '/orders', '/myOrders',
  '/multiOrders', '/eventOrders', '/ingredients',
  '/register', '/login', '/logout', '/account',
  '/contactus', '/sendEmail',
]

const proxy = Object.fromEntries(
  backendRoutes.map(route => [route, {
    target: 'http://localhost:5001',
    changeOrigin: true,
    bypass: (req) => {
      if (req.headers.accept?.includes('text/html')) return '/'
      return null
    },
  }])
)

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  plugins: [
    // Treat .js files in src/ that contain JSX syntax as JSX
    // (the existing project uses .js extension for JSX components)
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' })
      },
    },
    react(),
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      jsx: 'automatic',
    },
  },
  server: {
    port: 3000,
    proxy,
  },
  build: {
    outDir: 'dist',
  },
})
