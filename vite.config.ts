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
          {
            // Al-Husary's per-ayah recitation, which clips cut words from (ClipStep.audio,
            // src/data/quran-words.json): cached the same way, on first play.
            urlPattern: /^https:\/\/mirrors\.quranicaudio\.com\/everyayah\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'word-audio',
              expiration: { maxEntries: 100 },
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
    // Worker threads, not the default child-process forks: forks timed out on startup in the
    // sandboxed shell while other builds ran, failing the run with "no tests" (seen by T2, T3, T6).
    pool: 'threads',
    // On this 32-core machine vitest started ~31 jsdom workers at once; under load from builds some
    // missed the start-up timeout ('Timeout waiting for worker to respond', 'no tests'). Measured:
    // uncapped 25-76 s and flaky, 8 workers ~38 s and steady, 4 workers 43-86 s.
    maxWorkers: 8,
    setupFiles: ['./src/test/setup.ts'],
    // Task-board worktrees live inside the checkout; never pick up their tests.
    // e2e/** holds the Playwright UI suite, run separately via `npm run test:ui`.
    // android/** is the generated Capacitor project; apk/** holds `npm run apk` output.
    exclude: [...configDefaults.exclude, '.claude/**', 'e2e/**', 'android/**', 'apk/**'],
  },
})
