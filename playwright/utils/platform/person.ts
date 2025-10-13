import { faker } from '@faker-js/faker'
import { APIRequestContext } from '@playwright/test'
import { ROLES } from '../../data/platform/users'

/**
 * Helper method to send a POST request to the 'person' endpoint
 * @param {APIRequestContext} apiContext - the API request context for the test
 * @param {PersonCommand} input - the key/value pairs to send as the data in the request.
 *   { givenName: string,
 *     familyName: string,
 *     role: }
 * @returns {APIResponse} - the response object
 */
export async function createPerson(apiContext, input) {
  return await apiContext.post(`/person`, {
    data: { ...input }
  })
}
export async function deletePerson(apiContext, email) {
  return await apiContext.delete(`/person/${email}`)
}
export async function getAllPeople(apiContext) {
  return await apiContext.get('/person')
}
export async function getPerson(apiContext, email, impersonate = null) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  return await apiContext.get(`/person/${email}`, config)
}
/**
 * Helper method to send a PUT request to the 'person' endpoint
 * @param {APIRequestContext} apiContext - the API request context for the test
 * @param {string} email - the person's email
 * @param {PersonCommand} input - the key/value pairs to send as the data in the request.
 * @returns {APIResponse} - the response object
 */
export async function updatePerson(apiContext, email, input) {
  return await apiContext.put(`/person/${email}`, {
    data: { ...input }
  })
}
export async function updatePersonRole(apiContext, email, authority) {
  return await apiContext.put(`/person/${email}/role/${authority}`)
}
export async function deletePersonRole(apiContext, email, authority) {
  return await apiContext.delete(`/person/${email}/role/${authority}`)
}

export async function testPersonGenerator(
  request: APIRequestContext,
  input: PersonCommand = {},
  acceptToS: boolean = true
) {
  const firstName = input.givenName ? input.givenName : faker.person.firstName()
  const lastName = input.familyName ? input.familyName : faker.person.lastName()
  input.email = input.email
    ? input.email
    : faker.internet.email({
        firstName: firstName,
        lastName: lastName
      })
  input.givenName = firstName
  input.familyName = lastName
  input.role = input.role ? input.role : ROLES.rhUser.authority
  const resp = await createPerson(request, input)
  if (resp.status() !== 201) {
    await console.log('Person input:', input)
    await console.log('status:', resp.status())
    await console.log('json:', await resp.json())
    throw new Error('Create person failed!')
  }
  const person = (await resp.json()) as PersonSummary
  if (acceptToS) {
    const resp2 = await request.put('/me/consent/TERMS_OF_SERVICE', {
      headers: {
        'RH-Impersonation-Email': person.email
      },
      data: {
        accepted: '2023-10-08T18:06:23.112Z',
        version: 'f7170faf8d48561a00ea36adc22efc76'
      }
    })
    if (resp2.status() !== 200) {
      throw new Error('Accept ToS failed!')
    }
  }
  return person
}
