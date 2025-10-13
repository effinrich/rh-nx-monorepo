import { expect } from '@playwright/test'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  createCompany,
  deleteCompany
} from '../../../../../../../../utils/platform/company'

portalTest.beforeEach(async ({}, testInfo) => {
  const apiUrl = testInfo.config.metadata.apiURL
  const jwt = testInfo.config.metadata.jwt
  const apiContext = await newAPIContext(apiUrl, jwt)
  const companyName = 'Test: ' + testInfo.title
  const coNumber = Date.now() + parseInt(testInfo.title.substring(0, 1))
  const resp = await createCompany(apiContext, {
    name: companyName,
    number: coNumber,
    description: 'Test: ' + testInfo.title,
    legalName: 'Legal Name ' + testInfo.title
  })

  expect(resp.status()).toBe(201)
  const postRespJson = await resp.json()
  await apiContext.dispose()
  expect(postRespJson.id).toBeTruthy()
  testInfo.annotations.push({ type: 'coId', description: postRespJson.id })
  testInfo.annotations.push({ type: 'coName', description: companyName })
})

portalTest.afterEach(async ({}, testInfo) => {
  const apiUrl = testInfo.config.metadata.apiURL
  const jwt = testInfo.config.metadata.jwt
  const apiContext = await newAPIContext(apiUrl, jwt)
  const resp = await deleteCompany(
    apiContext,
    testInfo.annotations[0].description
  )
  await apiContext.dispose()
})

portalTest(
  'Admin can open "Add User" form from Users tab',
  async ({ signInAdmin, coPage }, testInfo) => {
    const coId = testInfo.annotations[0].description
    await coPage.goto(coId)
    await coPage.usersTabBtn.click()
    await coPage.usersTab.addUserBtn.click()
    await coPage.addUserForm.rhUserRB.click()
    await expect(coPage.addUserForm.companyAssignmentSel.icon).toBeVisible()
    await expect(coPage.addUserForm.modal).toHaveScreenshot()
  }
)
