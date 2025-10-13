import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../../../../data/platform/users'
import { portalTest } from '../../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  // newCompanyWithMember,
  deleteCompany
} from '../../../../../../../../utils/platform/company'
import { deletePerson } from '../../../../../../../../utils/platform/person'

const ROLES = [
  { role: 'RH User', radioBtn: 'rhUserRB' },
  { role: 'Company User', radioBtn: 'coUserRB' }
]
/**
 * 06/30/2023 - Disabling these tests for now becauses the
 * Request to Add User functionality is not currently supported
 */
// portalTest.describe('Request to Add Users', async () => {
//   let apiContext
//   let coId
//   let coName
//   let coNumber

//   portalTest.beforeEach(async ({}, testInfo) => {
//     apiContext = await newAPIContext(
//       testInfo.config.metadata.apiURL,
//       testInfo.config.metadata.jwt
//     )
//     coName = 'Test: ' + testInfo.title
//     coNumber = Date.now() + parseInt(testInfo.title.substring(0, 1))
//     coId = await newCompanyWithMember(
//       apiContext,
//       {
//         name: coName,
//         number: coNumber,
//         description: 'Test: ' + testInfo.title,
//         legalName: 'Legal Name ' + testInfo.title
//       },
//       PLATFORM_USERS.rhUser.email
//     )
//   })

//   portalTest.afterEach(async () => {
//     await deleteCompany(apiContext, coId)
//     await apiContext.dispose()
//   })

//   for (const role of ROLES) {
//     portalTest(
//       `Only 1 company option is available for "${role.role}" role`,
//       async ({ signInRHUser, coPage }) => {
//         await coPage.gotoAddUser(coId)
//         await coPage.addUserForm[role.radioBtn].click()
//         await expect
//           .soft(coPage.addUserForm.companyAssignmentSel.select)
//           .toBeVisible()
//         await expect
//           .soft(coPage.addUserForm.companyAssignmentSel.select)
//           .toHaveValue(coId)
//         await coPage.addUserForm.companyAssignmentSel.select.click()
//         await expect(
//           coPage.addUserForm.companyAssignmentSel.optionsList
//         ).toHaveCount(1)
//         await expect(coPage.addUserForm.modal).toHaveScreenshot(
//           `request-${role.role.replace(' ', '-')}.png`
//         )
//       }
//     )
//   }

//   portalTest.describe('Positive tests', async () => {
//     let email

//     portalTest.afterEach(async () => {
//       await deletePerson(apiContext, email)
//     })

//     for (const idx in ROLES) {
//       portalTest(
//         `${parseInt(idx) + 1} - RH User can request to add ${ROLES[idx].role}`,
//         async ({ signInRHUser, coPage }) => {
//           email = `test_${ROLES[idx].role.replace(
//             / /g,
//             '_'
//           )}_${Date.now()}@email.test`.toLowerCase()
//           const userdata = {
//             userType: ROLES[idx].role,
//             email: email,
//             firstName: `Test_${ROLES[idx].role}_fn`,
//             lastName: `Test_${ROLES[idx].role}_ln`,
//             company: coName
//           }
//           await coPage.gotoAddUser(coId)
//           await coPage.addUserForm.requestToAddUser(userdata)
//           await expect(coPage.addUserForm.success.requestMsg).toBeVisible()
//         }
//       )
//     }
//   })
// })
