import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      '/timetable': { target: 'http://46.101.98.64:8001', changeOrigin: true },
      '/bookings':  { target: 'http://46.101.98.64:8001', changeOrigin: true },
      '/notifications': { target: 'http://46.101.98.64:8001', changeOrigin: true },
      '/login':    { target: 'http://46.101.98.64:8088', changeOrigin: true },
      '/register': { target: 'http://46.101.98.64:8088', changeOrigin: true },
      '/me':       { target: 'http://46.101.98.64:8088', changeOrigin: true },
      '/clubs':    { target: 'http://46.101.98.64:8088', changeOrigin: true },
      '/dashboard':{ target: 'http://46.101.98.64:8088', changeOrigin: true },
    },
  },
})
