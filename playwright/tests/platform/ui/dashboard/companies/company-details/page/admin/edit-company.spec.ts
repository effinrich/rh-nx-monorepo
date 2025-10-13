import { expect } from '@playwright/test'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  createCompany,
  deleteCompany,
  getCompany
} from '../../../../../../../../utils/platform/company'

/**
 * https://redesignhealth.atlassian.net/browse/PLAT-4
 * As a RH administrator I need to CRUD OpCos
 */

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Edit Company - Admin', async () => {
  portalTest.setTimeout(90000)
  let apiContext
  let coData
  let coId

  portalTest.beforeEach(async ({}, testInfo) => {
    const id = Date.now() + Math.floor(Math.random() * 99999)
    coData = {
      name: `Test: ${testInfo.title}`,
      number: 8306623 + id,
      legalName: 'Test Legal Name: ' + id,
      description: 'Test description... \n' + testInfo.title
    }
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    const resp = await createCompany(apiContext, coData)
    expect(resp.status()).toBe(201)
    const json = await resp.json()
    await expect(json.id).toBeTruthy()
    coId = json.id
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  portalTest('1. Admin can update company', async ({ signInAdmin, coPage }) => {
    const coNumber = '1683861827'
    const editData = {
      name: coData.name.replace('Test', 'Edited'),
      number: coNumber,
      legalName: coData.legalName.replace('Test', 'Edited'),
      description: coData.description.replace('Test', 'Edited')
    }
    await coPage.editForm.goto(coId)
    await coPage.editForm.editCompany(editData)
    await expect(coPage.editForm.modal).not.toBeVisible()

    if (coPage.page.locator('.chakra-spinner').isVisible()) {
      await expect(coPage.page.locator('.chakra-spinner')).not.toBeVisible()
    }

    // check data persistence
    const resp = await getCompany(apiContext, coId)
    expect(resp.status()).toBe(200)
    const json = await resp.json()
    await expect.soft(json.name).toEqual(editData.name)
    await expect.soft(json.number).toEqual(parseInt(editData.number))
    await expect.soft(json.legalName).toEqual(editData.legalName)
    await expect.soft(json.description).toEqual(editData.description)

    // check company detail page
    await coPage.goto(coId)
    await expect(coPage.header.coName).toHaveText(editData.name)
  })

  portalTest(
    '2. Admin can click "Cancel" in Edit Company form',
    async ({ signInAdmin, coPage }) => {
      const editData = {
        name: coData.name.replace('Test', 'Edited')
      }
      await coPage.goto(coId)
      await coPage.header.editCoBtn.click()
      await coPage.editForm.fillout(editData)
      await coPage.editForm.cancelBtn.click()
      await expect.soft(coPage.header.coName).toHaveText(coData.name)
    }
  )

  portalTest.fixme(
    '3. Admin can click "X" in Edit Company form',
    async ({ signInAdmin, coPage }) => {
      const editData = {
        name: coData.name.replace('Test', 'Edited')
      }
      await coPage.goto(coId)
      await coPage.header.editCoBtn.click()
      await coPage.editForm.fillout(editData)
      await coPage.editForm.xcloseBtn.click()
      await expect.soft(coPage.header.coName).toHaveText(coData.name)
    }
  )
})
