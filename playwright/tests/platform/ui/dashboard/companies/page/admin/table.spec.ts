import { expect } from '@playwright/test'
import { portalTest } from '../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  createCompany,
  deleteCompany,
  getCompanies
} from '../../../../../../../utils/platform/company'

portalTest.describe('Companies table @dev-solo', async () => {
  let companiesCount
  portalTest.beforeEach(async ({}, testInfo) => {
    let apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    const resp = await getCompanies(apiContext)
    expect(resp.status()).toBe(200)
    const json = await resp.json()
    companiesCount = json.page.totalElements
  })
  portalTest(
    'Admin can view Companies page',
    async ({ signInAdmin, dashboard, companiesPage }) => {
      await dashboard.sidenav.companiesBtn.click()
      await expect.soft(companiesPage.mainpanel.heading).toBeVisible()
      await expect.soft(companiesPage.mainpanel.heading).toHaveText('Companies')
      await expect.soft(companiesPage.addCoBtn).toBeVisible()
      await expect.soft(companiesPage.addCoBtn).toHaveText('Add company')
      await expect.soft(companiesPage.coSectionHeading).toBeVisible()
      await expect.soft(companiesPage.coSectionHeading).toHaveText('Companies')
      await expect.soft(companiesPage.coCount).toBeVisible()
      await expect
        .soft(companiesPage.coCount)
        .toHaveText(companiesCount + ' total')
      await expect.soft(companiesPage.cosTable.table).toBeVisible()
      await expect.soft(companiesPage.cosTable.headerRow).toBeVisible()
      await expect
        .soft(companiesPage.cosTable.allHeaders)
        .toHaveText([
          'Name',
          'Status',
          '# of users',
          'Stage',
          'Date added',
          'Date updated',
          'Edit Company'
        ])
      await expect
        .soft(await companiesPage.cosTable.allRows.count())
        .toBe(companiesCount)
    }
  )
})

portalTest.describe('Edit Company form', async () => {
  let apiContext
  let coId
  const coName = `Test: Edit Company form`

  portalTest.beforeEach(async ({}, testInfo) => {
    const i = parseInt(testInfo.title.substring(0, 1))
    const coData = {
      name: coName,
      number: 76349690,
      description: `Testing the 'Edit Company' form`
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    const resp = await createCompany(apiContext, coData)
    expect(resp.status()).toBe(201)
    const json = await resp.json()
    coId = json.id
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  portalTest(
    'Admin can open the Edit Companyform from the Companies table',
    async ({ signInAdmin, companiesPage }) => {
      portalTest.setTimeout(60000)
      await companiesPage.goto(0, 9999)
      const row = await companiesPage.companyRow(coName)
      await row.editBtn.click()
      await expect(companiesPage.editForm.modal).toBeVisible()
      await expect(companiesPage.editForm.heading).toHaveText(/^Edit Company/)
    }
  )
})
