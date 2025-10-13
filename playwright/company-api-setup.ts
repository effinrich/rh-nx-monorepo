import { expect, FullConfig } from '@playwright/test'
import { updatePerson, updatePersonRole } from './utils/platform/person'
import { PLATFORM_USERS } from './data/platform/users'
import { request } from '@playwright/test'

async function SvcAPISetup(config: FullConfig) {
  if (process.env.JWT === undefined) {
    console.log('JWT was undefined')
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
    expect(resp.status()).toBe(200)
    const json = await resp.json()
    process.env.JWT = json.id_token
    await context.dispose()
  }

  console.log(
    `config.projects[0].metadata?.apiURL == ${config.projects[0].metadata?.apiURL}`
  )
  console.log(
    `config.projects[0].use.baseURL == ${config.projects[0].use.baseURL}`
  )
  const apiContext = await request.newContext({
    baseURL:
      config.projects[0].metadata?.apiURL || config.projects[0].use.baseURL,
    extraHTTPHeaders: { Authorization: `Bearer ${process.env.JWT}` }
  })

  const whoAmI = await (await apiContext.get('/userinfo')).json()
  expect(whoAmI.email).toBeDefined()
  console.log(`company-api-setup: running as ${whoAmI.email}`)
  expect(whoAmI.role?.authority).toBe('ROLE_SUPER_ADMIN')

  const USERS = ['admin', 'rhUser', 'coUser', 'noRole']
  for (const user of USERS) {
    const resp1 = await updatePerson(apiContext, PLATFORM_USERS[user].email, {
      givenName: PLATFORM_USERS[user].givenName,
      familyName: PLATFORM_USERS[user].familyName
    })
    expect(resp1.status()).toBe(200)

    if (user != 'noRole') {
      const resp2 = await updatePersonRole(
        apiContext,
        PLATFORM_USERS[user].email,
        PLATFORM_USERS[user].authority
      )
      expect(resp2.status()).toBe(200)
    }
  }

  // define forms for local environment
  if (config.projects[0].use.baseURL.includes('localhost')) {
    const respPriv = await apiContext.put(
      '/form-definition/PRIVACY_QUESTIONNAIRE',
      {
        data: {
          type: {
            displayName: 'Privacy Questionnaire',
            value: 'PRIVACY_QUESTIONNAIRE'
          },
          schema: {},
          links: [
            {
              rel: 'self',
              href: 'http://localhost:8080/form-definition/PRIVACY_QUESTIONNAIRE'
            }
          ]
        }
      }
    )
    expect(respPriv.status()).toBe(200)
    const respTechStack = await apiContext.put('/form-definition/TECH_STACK', {
      data: {
        type: {
          displayName: 'Tech Stack',
          value: 'TECH_STACK'
        },
        schema: {},
        links: [
          {
            rel: 'self',
            href: 'http://localhost:8080/form-definition/TECH_STACK'
          }
        ]
      }
    })
    expect(respTechStack.status()).toBe(200)
  }

  // accept ToS
  const resp3 = await apiContext.put('/me/consent/TERMS_OF_SERVICE', {
    data: {
      accepted: '2023-06-08T18:06:23.112Z',
      version: 'string'
    }
  })
  expect(resp3.status()).toBe(200)
  const VALID_USERS = ['admin', 'rhUser', 'coUser']
  for (const user of VALID_USERS) {
    const resp2 = await apiContext.put('/me/consent/TERMS_OF_SERVICE', {
      headers: {
        'RH-Impersonation-Email': PLATFORM_USERS[user].email
      },
      data: {
        accepted: '2023-06-08T18:06:23.112Z',
        version: 'f7170faf8d48561a00ea36adc22efc76'
      }
    })
    expect(resp2.status()).toBe(200)
  }

  await apiContext.dispose()
}

export default SvcAPISetup
