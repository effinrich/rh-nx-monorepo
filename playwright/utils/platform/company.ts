import { faker } from '@faker-js/faker'
import { APIRequestContext, expect, request } from '@playwright/test'
import { randomTaxonomy } from '../../data/platform/company-taxonomy'

export const FundraiseStatus = {
  PRE_LAUNCH_PHASE: {
    value: 'PRE_LAUNCH_PHASE',
    displayName: 'Pre launch phase'
  },
  PRE_SERIES_A: {
    value: 'PRE_SERIES_A',
    displayName: 'Pre Series A'
  },
  SERIES_A: {
    value: 'SERIES_A',
    displayName: 'Series A'
  },
  SERIES_B: {
    value: 'SERIES_B',
    displayName: 'Series B'
  },
  SERIES_C: {
    value: 'SERIES_C',
    displayName: 'Series C'
  }
}

export async function newAPIContext(baseURL, jwt) {
  const context = await request.newContext({
    baseURL: baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${jwt}`
    }
  })
  return context
}

export async function addMemberToCompany(
  apiContext,
  coId,
  email,
  status = 'ACTIVE'
) {
  return await apiContext.put(`/company/${coId}/member/${email}`, {
    data: { status: status }
  })
}
export async function removeMemberFromCompany(apiContext, coId, email) {
  return await apiContext.delete(`/company/${coId}/member/${email}`)
}
/**
 * Helper method to send a POST request to the 'company' endpoint
 * @param {APIRequestContext} apiContext - the API request context for the test
 * @param {Object} input - the key/value pairs to send as the data in the request.
 *   Fields are:
 *     - name {string} - Required
 *     - number {number} - Required
 *     - description {string} - Required
 *     - legalName {string} - Optional
 *
 * @returns {APIResponse} - the response object
 */
export async function createCompany(apiContext, input, impersonate = null) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  config['data'] = { createGFolder: false, ...input }
  config['timeout'] = 20_000
  return await apiContext.post('/company', config)
}
export async function createNewCo(apiContext, input) {
  // create Theme
  const themeInput = structuredClone(input)
  themeInput.name = themeInput.name + ' - Theme'
  themeInput.number = parseInt(themeInput.number + '0')
  themeInput.stage = 'THEME'
  const resp1 = await apiContext.post('/company', {
    data: {
      ...themeInput
    }
  })
  expect(resp1.status()).toBe(201)
  const theme = await resp1.json()

  // create Concept
  const conceptInput = structuredClone(input)
  conceptInput.name = conceptInput.name + ' - Concept'
  conceptInput.number = parseInt(conceptInput.number + '1')
  conceptInput.stage = 'CONCEPT'
  conceptInput.linkedApiId = theme.id
  const resp2 = await apiContext.post('/company', {
    data: {
      ...conceptInput
    }
  })
  try {
    expect(resp2.status()).toBe(201)
  } catch (err) {
    await console.log('resp2:', resp2)
    throw err
  }
  const concept = await resp2.json()

  // create New_Co
  const newCoInput = structuredClone(input)
  newCoInput.name = newCoInput.name + ' - NewCo'
  newCoInput.number = parseInt(newCoInput.number + '2')
  newCoInput.stage = 'NEW_CO'
  newCoInput.linkedApiId = concept.id
  const resp3 = await apiContext.post('/company', {
    data: {
      ...newCoInput
    }
  })
  try {
    expect(resp3.status()).toBe(201)
  } catch (err) {
    await console.log('resp3:', resp3)
    throw err
  }
  const newCo = await resp3.json()
  return { theme: theme, concept: concept, newCo: newCo }
}
export async function deleteCompany(apiContext, coId) {
  return await apiContext.delete(`/company/${coId}`)
}
export async function getCompanies(apiContext) {
  return await apiContext.get('/company?page=0&size=99999')
}
export async function getCompany(apiContext, coId, impersonate = null) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  return await apiContext.get(`/company/${coId}`, config)
}
export async function getCompanyMembers(apiContext, coId) {
  return await apiContext.get(`/company/${coId}/members`)
}
export async function getCompanyMemberStatus(apiContext, coId, email) {
  const resp = await getCompanyMembers(apiContext, coId)
  let json = await resp.json()
  for (const m of json.content) {
    if (m.email == email) {
      return m.status
    }
  }
  // no match if we made it this far
  throw new Error(`${email} not a member of ${coId}!`)
}
export async function getConflictIds(apiContext, coId) {
  const resp = await apiContext.get(`/company/${coId}/conflicts`)
  const json = await resp.json()
  return json.content.map(co => co.id).sort()
}
/**
 * Helper method to send a PUT request to the 'company' endpoint
 * @param {APIRequestContext} apiContext - the API request context for the test
 * @param {string} coId - the ID of the company
 * @param {Object} input - the key/value pairs to send as the data in the request.
 *   All fields are optional:
 *     - name {string}
 *     - number {number}
 *     - description {string}
 *     - legalName {string}
 * @returns {APIResponse} - the response object
 */
export async function updateCompany(
  apiContext,
  coId,
  input,
  impersonate = null
) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  config['data'] = { ...input }
  return await apiContext.put(`/company/${coId}`, config)
}
export async function updateCompanyInfraRequestStatus(
  apiContext,
  coId,
  status
) {
  return await apiContext.put(`/infra-request/${coId}`, {
    data: { status: status }
  })
}

export function testCompanyData(input: Object = {}) {
  const coName = input['name'] || faker.company.name()
  if (!input['fundraiseStatus']) {
    if (!input['stage'] || input['stage'] == 'OP_CO') {
      const key = faker.helpers.arrayElement(Object.keys(FundraiseStatus))
      input['fundraiseStatus'] = FundraiseStatus[key].value
    }
  }
    return {
      name: input['name'] || coName,
      number: input['number'] || Date.now() + Math.floor(Math.random() * 9999),
      legalName: input['legalName'] || `${coName} legal name`,
      description: input['description'] || faker.company.catchPhrase(),
      stage: input['stage'] || 'OP_CO',
      status: input['status'] || 'ACTIVE',
      linkedApiId: input['linkedApiId'] || null,
      createGFolder: input['createGFolder'] || false,
      href: input['href'] || faker.internet.url(),
      dashboardHref: input['dashboardHref'] || null,
      hasPlatformAgreement: input['hasPlatformAgreement'] || true,
      taxonomy: input['taxonomy'] || randomTaxonomy()[2].key,
      fundraiseStatus: input['fundraiseStatus']
    } as CompanyCommand
}

export async function testCompanyGenerator(
  request: APIRequestContext,
  input: CompanyCommand = {}
) {
  if (input.stage?.toLocaleUpperCase() === 'CONCEPT' && !input.linkedApiId) {
    const themeData = testCompanyData(input)
    themeData.stage = 'THEME'
    themeData.number = input.number + 1
    const theme = await testCompanyGenerator(request, themeData)
    input.linkedApiId = theme.id
  } else if (
    input.stage?.toLocaleUpperCase() === 'NEW_CO' &&
    !input.linkedApiId
  ) {
    const conceptData = testCompanyData(input)
    conceptData.stage = 'CONCEPT'
    conceptData.number = input.number + 2
    const concept = await testCompanyGenerator(request, conceptData)
    input.linkedApiId = concept.id
  } else {
    input = testCompanyData(input)
  }
  const resp = await createCompany(request, input)
  if (resp.status() !== 201) {
    await console.log('Company input:', input)
    await console.log('status:', resp.status())
    await console.log('json:', await resp.json())
    throw new Error('Create company failed!')
  }
  return (await resp.json()) as CompanySummary
}
