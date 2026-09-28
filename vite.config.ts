import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Relative asset paths: works on any static host subfolder and inside the Capacitor WebView.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'تعلّم التجويد · Learn Tajweed',
        short_name: 'Tajweed',
        description: 'Tajweed rules for beginners in Arabic and English',
        lang: 'ar',
        dir: 'rtl',
        start_url: './',
        display: 'standalone',
        theme_color: '#0f766e',
        background_color: '#fdfaf3',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
        runtimeCaching: [
          {
            // Recitation audio: cache once played so lessons work offline afterwards.
            urlPattern: /^https:\/\/everyayah\.com\/data\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'recitation-audio',
              expiration: { maxEntries: 300 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Task-board worktrees live inside the checkout; never pick up their tests.
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
})
