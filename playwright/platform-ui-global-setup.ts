import { firefox, FullConfig } from '@playwright/test'

/**
 * HOW TO UPDATE/SAVE a storageState.json file:
 * 1. Update the playwright config to run this script on startup
 *    e.g. add this line to the Playwright config file:
 *    globalSetup: require.resolve('./platform-ui-global-setup.ts'),
 * 2. Update the filename for the storageState you want to save (line 26 of this file)
 * 3. Run Playwright (any test is fine, you can abort execution as soon as the
 *    storageState file is saved)
 * 4. Firefox will open and execution will pause. Manually navigate the the URL
 *    where you need to log in. Log in for each user profile you want saved
 * 5. Resume execution once the browser (cookies) is in the state you want
 * 6. Abort execution after the storageState file is saved
 * 7. Revert step 1. to disable the globalSetup in the config file
 * 5. Run Playwright as normal with the new storageState
 */
async function globalSetup(config: FullConfig) {
  const browser = await firefox.launch({ headless: false })
  const page = await browser.newPage()

  await console.log('Load URL and log in.')
  await page.pause()

  await page.context().storageState({ path: 'storageState.json' })
  await browser.close()
}

export default globalSetup
