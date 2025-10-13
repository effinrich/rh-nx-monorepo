import { expect } from '@playwright/test'
import { portalTest } from '../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  deleteCompany
} from '../../../../../../../utils/platform/company'
import { faker } from '@faker-js/faker'

const epoch = Date.now()
const id1 = epoch + '1'
const id2 = epoch + '2'
const id3 = epoch + '3'
const id4 = epoch + '4'

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Form elements', () => {
  portalTest(
    `Internal name is required`,
    async ({ signInAdmin, companiesPage }) => {
      const input = {
        coNumber: id1,
        legalName: 'Test Legal Name ' + id1,
        stage: 'OpCo',
        description: 'Test description... ' + id1
      }
      await companiesPage.goto()
      await companiesPage.addCoBtn.click()
      await companiesPage.page
        .getByRole('menuitem', { name: 'RH company' })
        .click()
      await companiesPage.addCoForm.fillout(input)
      await expect(companiesPage.addCoForm.addCompanyBtn).toBeDisabled()
      await companiesPage.addCoForm.internalName.fill(
        'Test: Internal name is required'
      )
      await expect(companiesPage.addCoForm.addCompanyBtn).toBeEnabled()
    }
  )

  portalTest(
    'Click "X" to close Add Company form',
    async ({ signInAdmin, dashboard, companiesPage }) => {
      const id = `${Date.now()}`
      const input = {
        internalName: 'Cancel test ' + id2,
        coNumber: id2,
        legalName: 'Cancel test legal name ' + id2,
        description: 'Cancel test description... ' + id2
      }
      await dashboard.sidenav.companiesBtn.click()
      await companiesPage.addCoBtn.click()
      await companiesPage.page
        .getByRole('menuitem', { name: 'RH company' })
        .click()
      await companiesPage.addCoForm.fillout(input)
      await companiesPage.addCoForm.xcloseBtn.click()
      await expect(companiesPage.addCoForm.modal).not.toBeVisible()
    }
  )
})

portalTest.describe('Signed Platform Agreement', async () => {
  const not_visible = ['NewCo', 'Theme', 'Concept']

  for (const stage of not_visible) {
    portalTest(
      `Not visible with stage: ${stage}`,
      async ({ signInAdmin, companiesPage }) => {
        await companiesPage.addCoForm.goto()
        await companiesPage.addCoForm.fillout({ stage: stage })
        await expect(
          companiesPage.addCoForm.signedPlatformAgreement
        ).toHaveCount(0)
      }
    )
  }

  portalTest(
    'Default value is "No"',
    async ({ signInAdmin, companiesPage }) => {
      await companiesPage.addCoForm.goto()
      await companiesPage.addCoForm.fillout({ stage: 'OpCo' })
      const value = await companiesPage.addCoForm.isPlatformAgreementSigned()
      expect(value).toBe('No')
    }
  )
})

portalTest.describe('Create company', () => {
  portalTest.setTimeout(60000)
  let apiContext
  let coId

  portalTest.afterEach(async ({}, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  portalTest(
    'Admin can add a company',
    async ({ signInAdmin, addCoForm, companiesPage }, testInfo) => {
      const coData = {
        name: 'Test: Internal Name ' + id3,
        number: id3,
        legalName: 'Test Legal Name ' + id3,
        stage: 'OpCo',
        description: 'Test description... ' + id3,
        signedPlatformAgreement: faker.helpers.arrayElement(['Yes', 'No'])
      }
      await addCoForm.goto()
      await addCoForm.addCompany(coData)
      await expect(companiesPage.addCoForm.modal).not.toBeVisible({
        timeout: 15000
      })

      // check data persistence
      const apiContext = await newAPIContext(
        testInfo.config.metadata.apiURL,
        testInfo.config.metadata.jwt
      )
      const resp = await apiContext.get(
        '/company?page=0&size=9999&sort=created%2Cdesc'
      )
      expect(resp.status()).toBe(200)
      const json = await resp.json()
      const opco = json.content.find(x => x.name == coData.name)
      coId = opco.id
      expect.soft(opco.number.toString()).toBe(coData.number)
      expect.soft(opco.legalName).toBe(coData.legalName)
      expect.soft(opco.stage).toBe('OP_CO')
      expect.soft(opco.description).toBe(coData.description)
      const agreement = {
        Yes: true,
        No: false
      }
      expect
        .soft(opco.hasPlatformAgreement)
        .toBe(agreement[coData.signedPlatformAgreement])
    }
  )

  portalTest(
    'Legal Name is optional',
    async ({ signInAdmin, dashboard, companiesPage }) => {
      const coData = {
        name: 'Test: Internal Name ' + id4,
        number: id4,
        stage: 'OpCo',
        description: 'Test description... ' + id4
      }
      await dashboard.sidenav.companiesBtn.click()
      await companiesPage.addCoBtn.click()
      await companiesPage.page
        .getByRole('menuitem', { name: 'RH company' })
        .click()

      await companiesPage.addCoForm.addCompany(coData)
      await expect(companiesPage.addCoForm.modal).not.toBeVisible({
        timeout: 15000
      })

      // check UI
      await companiesPage.goto(0, 99999)
      await expect(await companiesPage.cosTable.table.textContent()).toContain(
        coData.name
      )
      const companyRow = await companiesPage.companyRow(coData.name)
      coId = await companyRow.coId()
    }
  )
})
