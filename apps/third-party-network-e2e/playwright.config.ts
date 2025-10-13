import { devices, PlaywrightTestConfig } from '@playwright/test'

const isCIRunning = Boolean(process.env['CI'])
const baseURL = process.env['BASE_URL']

const config: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: isCIRunning,
  reporter: isCIRunning ? 'github' : 'list',
  retries: 2,
  quiet: isCIRunning,
  use: {
    baseURL,
    trace: isCIRunning ? 'off' : 'on-first-retry',
    storageState: 'apps/third-party-network-e2e/storage-state.json'
  },
  projects: [{ name: 'Chrome', use: { ...devices['Desktop Chrome'] } }]
}

export default config
