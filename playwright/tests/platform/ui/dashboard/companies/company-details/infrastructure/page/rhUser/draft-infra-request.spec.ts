import { expect } from '@playwright/test'
import { testPersonGenerator } from '../../../../../../../../../utils/platform/person'
import { portalTest } from '../../../../../../../../../fixtures/platform-ui-test'
import { randomPrivacyData } from '../../../../../../../../../pages/platform-portal/dashboard/companies/company-details/infrastructure/privacy.form'
import { randomTechStackData } from '../../../../../../../../../pages/platform-portal/dashboard/companies/company-details/infrastructure/tech-stack.form'
import {
  newAPIContext,
  deleteCompany,
  testCompanyGenerator,
  addMemberToCompany
} from '../../../../../../../../../utils/platform/company'
import { impersonate } from '../../../../../../../../../utils/platform/utils'
import { deletePerson } from '../../../../../../../../../utils/platform/person'
import { ROLES } from '../../../../../../../../../data/platform/users'

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Draft Infra Request', async () => {
  let apiContext
  let person: PersonSummary
  let opco: CompanySummary

  portalTest.beforeEach(async ({ dashboard, coPage }, testInfo) => {
    const id = Date.now() + Math.floor(Math.random() * 99999)
    const coData = {
      name: `Test: Save Draft ${id}`,
      number: id,
      description: `Test ${id} - saving drafts`,
      legalName: `Test Legal Name ${id}`
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    person = await testPersonGenerator(apiContext, {
      role: ROLES.rhUser.authority
    })
    opco = await testCompanyGenerator(apiContext, coData)
    let resp = await addMemberToCompany(apiContext, opco.id, person.email)
    expect(resp.status()).toBe(200)

    await dashboard.goto()
    await impersonate(dashboard, person)
    await coPage.goto(opco.id)
  })

  portalTest.afterEach(async () => {
    await deletePerson(apiContext, person.email)
    await deleteCompany(apiContext, opco.id)
    await apiContext.dispose()
  })

  portalTest(`RH User can save Privacy draft`, async ({ coPage }) => {
    const input = randomPrivacyData(false)
    await coPage.draftPrivacy(input)
    await coPage.clickInfrastructureTab()
    const actualPrivacy = await coPage.reviewDraftPrivacy()
    await expect(actualPrivacy).toEqual(input)
  })
  portalTest(`RH User can save Tech Stack draft`, async ({ coPage }) => {
    const input = randomTechStackData(false)
    await coPage.draftTechStack(input)
    await coPage.clickInfrastructureTab()
    const actualTechStack = await coPage.reviewDraftTechStack()
    await expect(actualTechStack).toEqual(input)
  })
})
