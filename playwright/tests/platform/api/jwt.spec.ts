import { expect, firefox, test } from '@playwright/test'

/**
 * https://redesignhealth.atlassian.net/browse/PLAT-75
 * [backend] leverage JWT to check who is requesting access to a resource
 *
 * If user is not added to person table → 401
 * If jwt is expired → 401
 * If jwt is missing → 401
 * (remaining tests for correct permissions/resource will be covered elsewhere and are TBD)
 */

const BASE_URL = process.env.BASE_URL
const EXPIRED_JWT =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MzkyM2M4Y2ZlYzEwZjkyY2IwMTNkMDZlMWU3Y2RkNzg3NGFlYTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1MTA5OTkxMDMyMzEtZW1sZHNqdGUwa3ZzNW9lZTdndGxlb3FzZmh0cWMzZ2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1MTA5OTkxMDMyMzEtZW1sZHNqdGUwa3ZzNW9lZTdndGxlb3FzZmh0cWMzZ2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTMxNDU5MDQ0MDE5MDgxNjA1MjQiLCJlbWFpbCI6InJoZGV2b3BzdGVzdDVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJxNWZGREhQS2M5WGJXWHI5bW9VUUd3IiwibmFtZSI6Ik1vb24tVW5pdCBaYXBwYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UxQmpJQU9SV0JRMXlqVFl0ZmFQa21PdWlSMUw3bEFNaXVSMU9KXz1zOTYtYyIsImdpdmVuX25hbWUiOiJNb29uLVVuaXQiLCJmYW1pbHlfbmFtZSI6IlphcHBhIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Njk3NDk4NTcsImV4cCI6MTY2OTc1MzQ1N30.kIPU5wFkDVzFYJSyvIrHMaBxnLa8gAPCq2v88qIY_rR3GUkmhuaImESbsumXD-9HEN1VNOiBFEIihJe7Pm5TK-uwS8ASGfivP9qBPh8bqs5ili_jzZxhZiSOCLJnGzOf7ZV1DMebRTSfYbe8fxN3ufgCCS-mJw8Dd6auzaAzccnO7JNAQPgdUliQLLm_k4RPY6Wh7vMftDSTdb2U721POu5a5mmHuJsmzqorLlkXNvuAOHyOowx6G2CR18qdE5vF8-zSpckbR4vueApNb0BO4w2uR-rN2dhi67747SkoLeKkHB_Ys2_3wnYsNnKgI1f3Y6hXqwvrUAj9tpAdwal7Rw'

test.use({
  storageState: 'plat-StorageState-unregistered.json'
})

test('Expired JWT fails authentication', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${EXPIRED_JWT}`
    }
  })
  let getResp = await apiContext.get(`/person`)
  await expect.soft(getResp.status()).toBe(401)
  await apiContext.dispose()
})

test('Missing JWT fails authentication', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer `
    }
  })
  let getResp = await apiContext.get(`/person`)
  await expect.soft(getResp.status()).toBe(401)
  await apiContext.dispose()
})

test('Invalid JWT fails authentication', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer bogus_token`
    }
  })
  let getResp = await apiContext.get(`/person`)
  await expect.soft(getResp.status()).toBe(401)
  await apiContext.dispose()
})
