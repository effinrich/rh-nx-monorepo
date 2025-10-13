import { expect, test } from '@playwright/test'
import axios from 'axios'

test('Options of userinfo should not require a token', async () => {
  const resp = await axios.options(process.env.BASE_URL + '/userinfo', {
    headers: {
      'ACCESS-CONTROL-REQUEST-METHOD': 'GET',
      Origin: 'https://dev-platform.redesignhealth.com'
    }
  })
  await expect(resp.status).toEqual(200)
  await expect(resp.headers['access-control-allow-origin']).toEqual(
    'https://dev-platform.redesignhealth.com'
  )
})

test('Reject CORS for "example.org"', async () => {
  // expect().toThrow wasn't working so using try/catch instead
  let expectedError
  try {
    await axios.options(process.env.BASE_URL + '/userinfo', {
      headers: {
        'ACCESS-CONTROL-REQUEST-METHOD': 'GET',
        Origin: 'https://example.org'
      }
    })
  } catch (err) {
    expectedError = err
  }
  await expect(expectedError.message).toBe(
    'Request failed with status code 403'
  )
})

test('userinfo should not require a token', async ({ request }) => {
  const userInfo = await request.get(`/userinfo`, {})
  const userInfoJson = await userInfo.json()
  await expect(Object.keys(userInfoJson)).toContain('roles')
})
