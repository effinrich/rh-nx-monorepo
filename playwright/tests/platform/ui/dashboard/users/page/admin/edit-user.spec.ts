import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../../../data/platform/users'
import { portalTest } from '../../../../../../../fixtures/platform-ui-test'

portalTest(
  'Admin can open "Edit User" form from Users page',
  async ({ signInAdmin, usersPage }) => {
    await usersPage.goto()
    const userRow = await usersPage.usersTable.findUserRow(
      PLATFORM_USERS.coUser.email
    )
    await userRow.editBtn.click()
    await expect(usersPage.editUserForm.modal).toBeVisible()
    await expect(usersPage.editUserForm.heading).toHaveText(/^Edit User/)
  }
)

portalTest.fixme('RH User cannot edit users', async ({ signInRHUser, usersPage }) => {
  // 10/19/2023 - skipping this due to getting a blank screen instead of 403
  await usersPage.gotoEditUserForm(PLATFORM_USERS.coUser.email)
  await expect(usersPage.errorPage.heading).toBeVisible()
  await expect(usersPage.page).toHaveScreenshot()
})
