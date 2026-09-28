import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

/**
 * UI checks run against the production build (`npm run build`), served by `vite preview`, not
 * the dev server — closer to what a static host actually ships. Port 4173 (vite preview's
 * default) keeps this off the dev server's 5173 so both can run at once if needed.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
