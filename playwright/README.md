![Playwright](https://github.com/redesignhealth/rh-design-system/actions/workflows/playwright-company-api-tests.yml/badge.svg)

# Playwright

[**Playwright**](https://playwright.dev) is the tool we use for browser test automation. The playwright directory has the following sub-directories and files:

- **data** - Contains data that is used by multiple tests, e.g. test user info
- **fixtures** - Contains test fixtures used by tests. The portalTest fixture extends the built-in `test` fixture to include sign-ins for the test users and various page objects. (See https://playwright.dev/docs/test-fixtures for more info about Playwright fixtures.)
- **pages** - Contains the page object definitions and page component objects used by the tests.
- **tests** - Contains spec (test) files.
- **utils.ts** contains utility functions & helpers used by the tests (e.g. createCompany).

## Install Playwright

If you are not already in the playwright directory:

`cd playwright`

`npm install`

-OR-

Install playwright with Chromium

`npx playwright install --with-deps chromium`

## Run Tests

### Create artifact directories

`mkdir test-artifacts test-artifacts/screenshots playwright-report`

### Set environment variables for local run (devcontainer)

1. In a separate terminal, [run API using docker compose](../apps/company-api/README.md)
2. In a separate terminal, [run UI with nx](../apps/portal/README.md). Ensure that the UI is pointing to the local API that's running via docker compose by setting the `VITE_COMPANY_API_HOSTNAME` value in `/apps/portal/env.local` to `http://host.docker.internal:8080`. Note: the UI will not be accessible to you from your host machine with this setting. This is because playwright is running in the devcontainer.
3. Copy JWT from https://oauth.redesignhealth.com/. Note: you may need to refresh this token since it expires after some time.
4. Set the following environment variable in the terminal where you plan to run playwright

```bash
export JWT={from oauth}
export PLAYWRIGHT_UI_BASE_URL=http://localhost:4200
export PLAYWRIGHT_API_BASE_URL=http://host.docker.internal:8080
```

5. Run tests following the next steps

### Run platform UI tests from the [command line](https://playwright.dev/docs/running-tests#command-line)

`npx playwright test ./tests/platform/ui -c playwright.config.platform-ui.ts`

### Run platform API tests from the [command line](https://playwright.dev/docs/running-tests#command-line)

`npx playwright test ./tests/platform/api -c playwright.config.company-api.ts`

### Run tests from VS Code

1. Install the [VS Code Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
2. Select the 'Testing' icon from the left side nav
   <img width="46" alt="Screen Shot 2022-09-07 at 9 16 55 AM" src="https://user-images.githubusercontent.com/6857695/188928917-0ffb5eec-6c08-467f-a139-94608e4d243f.png">

3. Use the Test Explorer panel to find the test you want to run
4. Click on the 'Run Test' (arrow) button to start the test
   <img width="447" alt="Screen Shot 2022-09-07 at 9 18 40 AM" src="https://user-images.githubusercontent.com/6857695/188929176-554c8ab7-151e-42f4-a6aa-fa8ccb964af9.png">

## Debug tests

The built-in [Playwright debugger](https://playwright.dev/docs/debug) is much better than the debugger included with the VS Code Playwright extension.

`npx playwright [test] example --debug`

**NOTE:**
If you want to run only 1 test in a file, use the [`.only`](https://playwright.dev/docs/api/class-test#test-only) test method.
