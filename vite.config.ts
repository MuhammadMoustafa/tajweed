import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Relative asset paths: works on any static host subfolder and inside the Capacitor WebView.
  base: './',
  build: {
    rolldownOptions: {
      output: {
        // Libraries (React, Motion) change rarely: their own chunk keeps the app
        // chunk under the 500 kB warning as lessons are added, and lets the SW re-fetch only the app.
        codeSplitting: { groups: [{ name: 'vendor', test: /node_modules/ }] },
      },
    },
  },
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
    // Start-up cost is the environment, not the tests. A vitest worker must report "started"
    // within 60 s, and for jsdom that means importing jsdom: ~960 CommonJS files, ~1.5 s alone but
    // bound by file-system calls (stat/lstat/read, where Windows' real-time scanning sits), so
    // parallel imports queue: 8 at once take ~3 s each, 16 ~6 s, and the first run after `npm ci`
    // in a fresh worktree took 31 s for one. With every file on jsdom and a new worker per file,
    // a run loaded jsdom 59 times, 8 at a time, and under a second run or a build some workers
    // missed the 60 s ('Timeout waiting for worker to respond', 'no tests'). So:
    // - pure-logic tests (*.test.ts) run in node and load neither jsdom nor jest-dom; the few that
    //   need a DOM say so with a `// @vitest-environment jsdom` docblock;
    // - component tests (*.test.tsx) use vmThreads: each worker imports jsdom once and runs every
    //   file in a fresh VM context with its own window, so files stay isolated.
    // Measured (full suite alone): 25-34 s before, 8-10 s after.
    // Worker threads, not child-process forks: forks timed out on startup in the sandboxed shell
    // while other builds ran (seen by T2, T3, T6). 8 workers leave room for a second run or a build.
    pool: 'threads',
    maxWorkers: 8,
    // Task-board worktrees live inside the checkout; never pick up their tests.
    // e2e/** holds the Playwright UI suite, run separately via `npm run test:ui`.
    // android/** is the generated Capacitor project; apk/** holds `npm run apk` output.
    exclude: [...configDefaults.exclude, '.claude/**', 'e2e/**', 'android/**', 'apk/**'],
    projects: [
      {
        extends: true,
        test: { name: 'logic', environment: 'node', include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'] },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          pool: 'vmThreads',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.tsx'],
          // Timeouts here only catch a hang; they must not turn a busy machine into a failure. A
          // render of the whole home list or a full lesson takes 0.2-0.7 s alone but passed 5 s
          // with eight workers busy, and a CI runner is slower still. (findBy* waits: setup.ts.)
          testTimeout: 60_000,
        },
      },
    ],
  },
})
