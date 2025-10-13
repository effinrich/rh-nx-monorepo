import { defineConfig } from '@playwright/test'
import { devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/platform/ui',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio:
        Number(process.env.PLAYWRIGHT_MAX_DIFF_PIXEL_RATIO) || undefined
    }
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  // maxFailures: process.env.CI ? 5 : 0,
  /* Retry on CI only */
  retries: 0, // process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 4, // '100%',
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['github']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // globalSetup: require.resolve('./platform-ui-global-setup.ts'),
  globalSetup: require.resolve('./company-api-setup.ts'),
  metadata: {
    apiURL:
      process.env.PLAYWRIGHT_API_BASE_URL ||
      'https://company-api.dev.redesignhealth.com/public/open-api',
    jwt: process.env.JWT
  },
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:4200',
    baseURL:
      process.env.PLAYWRIGHT_UI_BASE_URL ||
      'https://platform.dev.redesignhealth.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure'
    trace: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        viewport: { width: 1440, height: 1024 }
      }
    }
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox']
    //   }
    // }
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'screenshots'

  /* Run your local dev server before starting the tests */
  // webServer: {
  //  command: 'cd .. && npx nx serve portal',
  //  port: 4200
  // }
})
