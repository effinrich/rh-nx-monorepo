import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../../../data/platform/users'
import { portalTest } from '../../../../../../../fixtures/platform-ui-test'
import {
  newAPIContext,
  createCompany,
  deleteCompany
} from '../../../../../../../utils/platform/company'
import {
  deletePerson,
  getPerson
} from '../../../../../../../utils/platform/person'
import { wait } from '../../../../../../../utils/platform/utils'

portalTest.describe.configure({ mode: 'parallel' })
portalTest(
  'Admin can open "Add User" form from Users page',
  async ({ signInAdmin, usersPage }) => {
    await usersPage.goto()
    await usersPage.addUserBtn.click()
    await expect(usersPage.addUserForm.modal).toHaveScreenshot()
  }
)

const ROLES = [
  { role: 'Admin', radioBtn: 'adminRB' },
  { role: 'RH User', radioBtn: 'rhUserRB' },
  { role: 'Company User', radioBtn: 'coUserRB' }
]
for (const role of ROLES) {
  portalTest(
    `Selecting User type "${role.role}" unhides other fields`,
    async ({ signInAdmin, usersPage }) => {
      await usersPage.gotoAddUserForm()
      await usersPage.addUserForm[role.radioBtn].click()
      await expect.soft(usersPage.addUserForm.emailTB).toBeVisible()
      await expect.soft(usersPage.addUserForm.givenNameTB).toBeVisible()
      await expect.soft(usersPage.addUserForm.familyNameTB).toBeVisible()
      await expect
        .soft(usersPage.addUserForm.companyAssignmentSel.icon)
        .toBeVisible()
      await expect.soft(usersPage.addUserForm.cancelBtn).toBeEnabled()
      await expect(usersPage.addUserForm.modal).toHaveScreenshot()
    }
  )
}
for (const role of ROLES) {
  portalTest(
    `No default company selected for "${role.role}" role`,
    async ({ signInAdmin, usersPage }) => {
      await usersPage.gotoAddUserForm()
      await usersPage.addUserForm[role.radioBtn].click()
      await expect
        .soft(usersPage.addUserForm.companyAssignmentSel.icon)
        .toBeVisible()
      await expect
        .soft(usersPage.addUserForm.companyAssignmentSel.input)
        .toHaveValue('')
    }
  )
}

portalTest.describe('Add Users', async () => {
  portalTest.setTimeout(60000)

  let apiContext
  let coId
  let coName

  portalTest.beforeEach(async ({}, testInfo) => {
    apiContext = await newAPIContext(
      testInfo.config.metadata.apiURL,
      testInfo.config.metadata.jwt
    )
    coName = 'Test: ' + testInfo.title
    const coNumber = Date.now() + parseInt(testInfo.title.substring(0, 1))
    const resp = await createCompany(apiContext, {
      name: coName,
      number: coNumber,
      description: 'Test: ' + testInfo.title,
      legalName: 'Legal Name ' + testInfo.title
    })
    expect(resp.status()).toBe(201)
    const postRespJson = await resp.json()
    expect(postRespJson.id).toBeTruthy()
    coId = postRespJson.id
  })

  portalTest.afterEach(async () => {
    await deleteCompany(apiContext, coId)
    await apiContext.dispose()
  })

  portalTest.describe('Positive tests', async () => {
    let email

    portalTest.afterEach(async () => {
      await deletePerson(apiContext, email)
    })

    for (const idx in ROLES) {
      portalTest(
        `${parseInt(idx) + 1} - Admin can add user ${ROLES[idx].role}`,
        async ({ signInAdmin, usersPage }) => {
          const before = new Date()
          const role = ROLES[idx].role
          const roleStr = role.replace(/ /g, '-')
          email = `test_${roleStr}_${Date.now()}@email.test`.toLowerCase()
          const userdata = {
            userType: role,
            email: email,
            givenName: `Test_${role}_fn`,
            familyName: `Test_${role}_ln`,
            company: coName
          }
          await usersPage.gotoAddUserForm()
          await usersPage.addUserForm.addUser(userdata)
          await wait(2000)

          // check data persistence
          const resp = await getPerson(apiContext, userdata.email)
          expect(resp.status()).toBe(200)
          const json = await resp.json()
          await expect.soft(json.email).toBe(userdata.email)
          await expect.soft(json.givenName).toBe(userdata.givenName)
          await expect.soft(json.familyName).toBe(userdata.familyName)
          await expect.soft(json.role.displayName).toBe(userdata.userType)
          const after = new Date()
          await expect
            .soft(new Date(json.created).valueOf())
            .toBeGreaterThanOrEqual(before.valueOf())
          await expect
            .soft(new Date(json.created).valueOf())
            .toBeLessThanOrEqual(after.valueOf())
        }
      )
    }
  })

  portalTest.describe('Negative tests', async () => {
    const USER_ROLES = ['Admin', 'RH User', 'Company User']
    const REQUIRED_FIELDS = ['email', 'givenName', 'familyName']
    for (const role of USER_ROLES) {
      for (const idx in REQUIRED_FIELDS) {
        portalTest(
          `${REQUIRED_FIELDS[idx]} is required for ${role}`,
          async ({ signInAdmin, usersPage }) => {
            const fieldName = REQUIRED_FIELDS[idx]
            const input = {
              email: `Test_admin_req_${fieldName}@email.test`,
              givenName: `Test_fn`,
              familyName: `Test_ln`
            }
            const input2 = {}
            input2[fieldName] = input[fieldName]
            await usersPage.gotoAddUserForm()
            delete input[fieldName]
            await usersPage.addUserForm.fillout({ userType: role, ...input })
            await expect(usersPage.addUserForm.addUserBtn).toBeDisabled()
            await usersPage.addUserForm.fillout(input2)
            await expect(usersPage.addUserForm.addUserBtn).toBeEnabled()
          }
        )
      }
    }

    portalTest('Email must be valid', async ({ signInAdmin, usersPage }) => {
      const input = {
        userType: 'Admin',
        email: `Test_valid_email`,
        givenName: `Test_valid_email_fn`,
        familyName: `Test_valid_email_ln`,
        company: coName
      }
      await usersPage.gotoAddUserForm()
      await usersPage.addUserForm.fillout(input)
      await expect(usersPage.addUserForm.addUserBtn).toBeDisabled()
      await usersPage.addUserForm.emailTB.fill('Test_email@email.test')
      await expect(usersPage.addUserForm.addUserBtn).toBeEnabled()
    })

    // 07/19/2023 - skipping this due to
    // https://redesignhealth.atlassian.net/browse/PUD-383
    portalTest.skip(
      'Email must be unique',
      async ({ signInAdmin, usersPage }) => {
        const input = {
          userType: 'Company User',
          email: PLATFORM_USERS.coUser.email,
          givenName: PLATFORM_USERS.coUser.givenName,
          familyName: PLATFORM_USERS.coUser.familyName,
          company: coName
        }
        await usersPage.gotoAddUserForm()
        await usersPage.addUserForm.addUser(input)
        await expect(usersPage.addUserForm.chakraAlert.wrapper).toBeVisible()
        await expect(usersPage.addUserForm.chakraAlert.description).toHaveText(
          'email must be unique'
        )
        await expect(usersPage.addUserForm.modal).toHaveScreenshot()
      }
    )
  })
})

/**
 * 07/19/2023 - Skipping these tests since the confirmation dialog was removed
 */
// portalTest.describe('Discard changes confirmation dialog', async () => {
//   portalTest(
//     'Dialog appears after clicking Cancel',
//     async ({ signInAdmin, usersPage }) => {
//       await usersPage.gotoAddUserForm()
//       await usersPage.addUserForm.adminRB.click()
//       await usersPage.addUserForm.cancelBtn.click()
//       await expect(
//         usersPage.addUserForm.discardChangesDialog.modal
//       ).toBeVisible()
//       await expect(
//         usersPage.addUserForm.discardChangesDialog.modal
//       ).toHaveScreenshot('discard-changes.png')
//     }
//   )
//   portalTest(
//     'Clicking Take me back returns to Add User form',
//     async ({ signInAdmin, usersPage }) => {
//       await usersPage.gotoAddUserForm()
//       await usersPage.addUserForm.adminRB.click()
//       await usersPage.addUserForm.cancelBtn.click()
//       await usersPage.addUserForm.discardChangesDialog.takeMeBackBtn.click()
//       await expect(usersPage.addUserForm.heading).toBeVisible()
//       await expect(usersPage.addUserForm.modal).toHaveScreenshot()
//     }
//   )
//   portalTest(
//     'Clicking Discard changes returns to the Users page',
//     async ({ signInAdmin, usersPage }) => {
//       await usersPage.gotoAddUserForm()
//       await usersPage.addUserForm.adminRB.click()
//       await usersPage.addUserForm.cancelBtn.click()
//       await usersPage.addUserForm.discardChangesDialog.discardChangesBtn.click()
//       await expect(usersPage.addUserForm.heading).not.toBeVisible()
//       await expect(usersPage.usersTable.table).toBeVisible()
//     }
//   )
// })
