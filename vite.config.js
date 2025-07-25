import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'

// Get current timestamp for cache busting
const timestamp = new Date().getTime()

export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    port: 3000, // or any port you prefer
    proxy: {
      '/api': {
        target: 'https://ops.sgcloud.com.au',
        changeOrigin: true,
        secure: true,
        headers: {
          'Origin': 'https://ops.sgcloud.com.au'
        }
      }
    }
  },
  build: {
    // Generate manifest.json in outDir
    manifest: true,
    // Customize the output directory
    outDir: 'dist',
    // Memory optimization
    chunkSizeWarningLimit: 1000,
    // Configure rollup options
    rollupOptions: {
      output: {
        // Add timestamp to entry file names
        entryFileNames: `assets/[name].${timestamp}.[hash].js`,
        // Add timestamp to chunk file names
        chunkFileNames: `assets/[name].${timestamp}.[hash].js`,
        // Add timestamp to asset file names
        assetFileNames: `assets/[name].${timestamp}.[hash].[ext]`,
        // Manual chunking for better memory usage
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@headlessui/vue', 'lucide-vue-next'],
          'map-vendor': ['leaflet', 'leaflet-draw'],
          'editor-vendor': ['ace-builds', 'vue3-ace-editor', 'signature_pad'],
          'utils-vendor': ['axios', 'lodash', 'date-fns']
        }
      }
    }
  }
}) 