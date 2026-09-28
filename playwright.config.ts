import { defineConfig, devices } from '@playwright/test'

// Override with PW_PORT when several worktrees run the suite at once.
const PORT = Number(process.env.PW_PORT ?? 4173)

/**
 * UI checks run against the production build (`npm run build`), served by `vite preview`, not
 * the dev server — closer to what a static host actually ships. Port 4173 (vite preview's
 * default) keeps this off the dev server's 5173 so both can run at once if needed.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // No retries: a test that only passes on a rerun is flaky and must be reported as such.
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'en-US',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // Never reuse: a server already on this port may be another worktree's build, which would
    // silently test the wrong code. With --strictPort a busy port fails the run instead.
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
