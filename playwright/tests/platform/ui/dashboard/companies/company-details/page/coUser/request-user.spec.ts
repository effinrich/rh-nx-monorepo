import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../../../../data/platform/users'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  // newCompanyWithMember,
  deleteCompany
} from '../../../../../../../../utils/platform/company'
import { deletePerson } from '../../../../../../../../utils/platform/person'

/**
 * 06/30/2023 - Removing these tests for now because the
 * Request User funcionality is not currently supported
 */
// portalTest.use({
//   storageState: 'plat-StorageState-multi-user.json'
// })
// portalTest.describe('Request to Add Users', async () => {
//   let apiContext
//   let companyName
//   let coNumber
//   let coId

//   portalTest.beforeEach(async ({}, testInfo) => {
//     apiContext = await newAPIContext(
//       testInfo.config.metadata.apiURL,
//       testInfo.config.metadata.jwt
//     )
//     companyName = 'Test: ' + testInfo.title
//     coNumber = Date.now() + testInfo.title.length
//     coId = await newCompanyWithMember(
//       apiContext,
//       {
//         name: companyName,
//         number: coNumber,
//         description: 'Test: ' + testInfo.title,
//         legalName: 'Legal Name ' + testInfo.title
//       },
//       PLATFORM_USERS.coUser.email
//     )
//   })

//   portalTest.afterEach(async () => {
//     await deleteCompany(apiContext, coId)
//     await apiContext.dispose()
//   })

//   portalTest(
//     `Only 1 company option is available from company detail page`,
//     async ({ signInCoUser, coPage }) => {
//       await coPage.goto(coId)
//       // check that the Co User can open the Add User form from
//       // the company details header
//       await coPage.header.addUserBtn.click()
//       await expect
//         .soft(coPage.addUserForm.companyAssignmentSel.select)
//         .toBeVisible()
//       await expect
//         .soft(coPage.addUserForm.companyAssignmentSel.select)
//         .toHaveValue(coId)
//       await coPage.addUserForm.companyAssignmentSel.select.click()
//       await expect(
//         coPage.addUserForm.companyAssignmentSel.optionsList
//       ).toHaveCount(1)
//       await expect(coPage.addUserForm.modal).toHaveScreenshot(
//         'request-user.png'
//       )
//     }
//   )

//   portalTest.describe('Positive tests', async () => {
//     let email

//     portalTest.afterEach(async ({}) => {
//       const resp2 = await deletePerson(apiContext, email)
//     })

//     portalTest(
//       `Company User can request to add Company User`,
//       async ({ signInCoUser, coPage }) => {
//         portalTest.setTimeout(60000)
//         email = `test_couser_${Date.now()}@email.test`.toLowerCase()
//         const userdata = {
//           email: email,
//           firstName: `Test_CoUser_fn`,
//           lastName: `Test_CoUser_ln`,
//           company: coId
//         }
//         await coPage.gotoAddUser(coId)
//         await coPage.addUserForm.requestToAddUser(userdata)
//         await expect(coPage.addUserForm.success.requestMsg).toBeVisible()
//       }
//     )
//   })
// })
