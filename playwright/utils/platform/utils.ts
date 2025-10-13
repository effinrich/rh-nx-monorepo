import { request } from '@playwright/test'

export async function getJWT() {
  await console.log('Logging in to Google')
  const context = await request.newContext()
  const resp = await context.post(
    'https://www.googleapis.com/oauth2/v4/token',
    {
      data: {
        grant_type: 'refresh_token',
        client_id: process.env.PLAYWRIGHT_CLIENT_ID,
        client_secret: process.env.PLAYWRIGHT_CLIENT_SECRET,
        refresh_token: process.env.PLAYWRIGHT_REFRESH_TOKEN
      }
    }
  )

  const json = await resp.json()
  process.env.JWT = json.id_token
  await console.log('JWT:', process.env.JWT)
}

export async function wait(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

export function convertSearchCommandToQueryParams(
  searchCommand: SearchCommand
) {
  const queryParams: string[][] = []
  const { q, filters } = searchCommand
  if (q) {
    queryParams.push(['q', q])
  }
  if (filters) {
    const filterQueryString = filters.map(filter => [
      'filter',
      filter.join(',')
    ])
    queryParams.push(...filterQueryString)
  }
  return new URLSearchParams(queryParams)
}

export async function impersonate(page, user) {
  await page.page.addInitScript(
    ({ jwt, user }) => {
      const USER_ACCESS_TOKEN_LOCALSTORAGE_KEY = 'userAccessToken'
      const IMPERSONATED_EMAIL_LOCALSTORAGE_KEY = 'impersonatedEmail'

      window.localStorage.setItem(USER_ACCESS_TOKEN_LOCALSTORAGE_KEY, jwt)
      if (user && user.authority !== 'ROLE_SUPER_ADMIN') {
        window.localStorage.setItem(
          IMPERSONATED_EMAIL_LOCALSTORAGE_KEY,
          user.email
        )
      }
    },
    { jwt: process.env.JWT, user }
  )
  await page.goto()
}
