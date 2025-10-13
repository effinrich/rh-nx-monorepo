import { APIRequestContext } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  businessFocusAreas,
  businessType,
  customerSegments,
  healthcareSectors,
  location,
  marketServiceAreas
} from '../../data/platform/ceos'
import { convertSearchCommandToQueryParams } from './utils'

export async function createCEO(
  apiContext: APIRequestContext,
  input: CEOCommand = {},
  impersonate = null
) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  config['data'] = { ...input }
  return await apiContext.post('/ceos', config)
}

export async function deleteCEO(apiContext: APIRequestContext, ceoId: string) {
  return await apiContext.delete(`/ceos/${ceoId}`)
}

export async function getAllCEOs(apiContext: APIRequestContext) {
  return await apiContext.get(`/ceos`)
}

export async function filterCEOs(
  apiContext: APIRequestContext,
  filter?: string
) {
  return apiContext.get(`/ceos?page=0&filter=${filter}&sort=member.email,asc`)
}
export async function getCEO(
  apiContext: APIRequestContext,
  ceoId: string,
  impersonate?: string
) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  return await apiContext.get(`/ceos/${ceoId}`, config)
}

export async function getCEOFilters(apiContext: APIRequestContext) {
  let config = {}
  return await apiContext.get(`/ceos/filters`, config)
}

export async function updateCEO(
  apiContext: APIRequestContext,
  ceoId: string,
  input: CEOCommand,
  impersonate?: string
) {
  let config = {}
  if (impersonate) {
    config['headers'] = { 'RH-Impersonation-Email': impersonate }
  }
  config['data'] = input
  return await apiContext.get(`/ceos/${ceoId}`, config)
}

export function testCEOData(input: CEOCommand = {}) {
  input.email = input.email || faker.internet.email()
  input.businessType =
    input.businessType || faker.datatype.boolean()
      ? faker.helpers.enumValue(businessType)
      : null
  input.location =
    input.location || faker.datatype.boolean()
      ? faker.helpers.enumValue(location)
      : null
  if (!input.marketServiceArea && faker.datatype.boolean()) {
    input.marketServiceArea = faker.datatype.boolean({ probability: 0.9 })
      ? faker.helpers.arrayElements(marketServiceAreas, { min: 0, max: 5 })
      : ['All Domestic US']
  }
  if (!input.customerSegment && faker.datatype.boolean()) {
    input.customerSegment = faker.helpers.arrayElements(
      Object.keys(customerSegments)
    )
  }
  if (!input.businessFocusArea && faker.datatype.boolean()) {
    input.businessFocusArea = faker.helpers.arrayElements(
      Object.keys(businessFocusAreas),
      { min: 1, max: 5 }
    )
  }
  if (!input.healthcareSector && faker.datatype.boolean()) {
    input.healthcareSector = faker.helpers.arrayElement(
      Object.keys(healthcareSectors)
    )
  }
  if (!input.bio && faker.datatype.boolean()) {
    input.bio = faker.person.bio()
  }
  if (!input.additionalInfo && faker.datatype.boolean()) {
    input.additionalInfo = faker.word.words()
  }
  if (!input.linkedinHref && faker.datatype.boolean()) {
    input.linkedinHref = faker.internet.url()
  }
  if (!input.pictureHref && faker.datatype.boolean()) {
    input.pictureHref = faker.internet.avatar()
  }
  if (!input.visible && faker.datatype.boolean()) {
    input.visible = faker.helpers.arrayElement(['OPT_IN', 'OPT_OUT'])
  }
  return input
}

export async function testCEOGenerator(
  request: APIRequestContext,
  input: CEOCommand = {}
) {
  if (Object.keys(input).length === 0) {
    input = testCEOData(input)
  }
  const resp = await createCEO(request, input)
  if (resp.status() !== 201) {
    console.log('CEO input:', input)
    console.log('status:', resp.status())
    console.log(await resp.json())
    throw new Error('Create CEO failed!')
  }
  return (await resp.json()) as CEOSummary
}

export function mapCEOSummaryToProfilePage(ceoSum: CEOSummary) {
  let ceoPg = {}
  if (ceoSum.member.familyName || ceoSum.member.givenName) {
    ceoPg['name'] = `${ceoSum.member.givenName} ${ceoSum.member.familyName}`
  }
  ceoPg['email'] = ceoSum.member.email
  if (ceoSum.location) {
    ceoPg['location'] = ceoSum.location
  }
  if (ceoSum.member.company) {
    ceoPg['company'] = ceoSum.member.company.name
  }
  if (ceoSum.member.company.description) {
    ceoPg['coDesc'] = ceoSum.member.company.description
  }
  if (ceoSum.member.company.href) {
    ceoPg['coHref'] = ceoSum.member.company.href
  }
  if (ceoSum.member.company.fundraiseStatus.displayName) {
    ceoPg['fundraisingStage'] =
      ceoSum.member.company.fundraiseStatus.displayName
  }
  if (ceoSum.businessType) {
    ceoPg['businessType'] = ceoSum.businessType.displayName
  }
  if (ceoSum.customerSegment.length > 0) {
    ceoPg['customerSegment'] = ceoSum.customerSegment.map(s => s.displayName)
  }
  if (ceoSum.healthcareSector) {
    ceoPg['healthcareSector'] = ceoSum.healthcareSector.displayName
  }
  if (ceoSum.businessFocusArea.length > 0) {
    ceoPg['businessFocusArea'] = ceoSum.businessFocusArea.map(
      a => a.displayName
    )
  }
  if (ceoSum.marketServiceArea?.length) {
    ceoPg['marketServiceArea'] = ceoSum.marketServiceArea
  }
  if (ceoSum.linkedinHref) {
    ceoPg['linkedInProfileUrl'] = ceoSum.linkedinHref
  }
  if (ceoSum.bio) {
    ceoPg['bio'] = ceoSum.bio
  }

  return ceoPg
}
