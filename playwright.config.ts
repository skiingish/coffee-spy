import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      scale: 'css',
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'edge',
      use: { channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'npx next dev -p 3100',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: '',
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: '',
      NEXT_PUBLIC_ADSENSE_CLIENT: '',
      NEXT_PUBLIC_ADSENSE_SLOT: '',
    },
  },
});
