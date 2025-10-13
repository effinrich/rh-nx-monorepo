import { expect } from '@playwright/test'
import { PLATFORM_USERS } from '../../../../../data/platform/users'
import { portalTest } from '../../../../../fixtures/platform-ui-test'
import {
  getCompanies,
  newAPIContext
} from '../../../../../utils/platform/company'

portalTest.describe.configure({ mode: 'parallel' })
portalTest(
  'Home Page - Admin fields & values',
  async ({ signInAdmin, dashboard }) => {
    await expect.soft(dashboard.sidenav.logoIcon).toBeVisible()
    await expect.soft(dashboard.sidenav.homeBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.companiesBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.usersBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.libraryBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.researchHubBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.ceoDirectoryBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.developersBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.supportAndFeedbackBtn).toBeVisible()
    await expect.soft(dashboard.sidenav.username).toBeVisible()
    await expect
      .soft(dashboard.sidenav.username)
      .toHaveText(
        `${PLATFORM_USERS.admin.givenName} ${PLATFORM_USERS.admin.familyName}`
      )
    await expect.soft(dashboard.sidenav.logoutBtn).toBeVisible()
    await expect.soft(dashboard.mainpanel.heading).toBeVisible()
    await expect
      .soft(dashboard.mainpanel.heading)
      .toHaveText(`Welcome, ${PLATFORM_USERS.admin.givenName}`)
    await expect.soft(dashboard.mainpanel.cosCount).toBeVisible()
    await expect.soft(dashboard.mainpanel.cosCount).toHaveText(/[0-9].*/)
    await expect.soft(dashboard.mainpanel.viewCompaniesBtn).toBeVisible()
    await expect.soft(dashboard.mainpanel.usersCount).toBeVisible()
    await expect.soft(dashboard.mainpanel.usersCount).toHaveText(/[0-9].*/)
    await expect.soft(dashboard.mainpanel.viewAllUsersBtn).toBeVisible()
    await expect.soft(dashboard.mainpanel.assignUsersHeading).toBeVisible()
    await expect
      .soft(dashboard.mainpanel.assignUsersHeading)
      .toHaveText('Add and assign users to existing companies')
    await expect.soft(dashboard.mainpanel.addUserBtn).toBeVisible()
  }
)

portalTest(
  'Home Page, Services card - Admin @dev',
  async ({ signInAdmin, dashboard }) => {
    // click something else first
    await expect.soft(dashboard.mainpanel.servicesHeading).toBeVisible()
    await expect
      .soft(dashboard.mainpanel.servicesHeading)
      .toHaveText('Set up services, answer questionnaires, and assign users')
    await expect.soft(dashboard.mainpanel.addCoBtn).toBeVisible()
  }
)

portalTest(
  'Home Page, Users card - Admin @dev',
  async ({ signInAdmin, dashboard }) => {
    // click something else first
    await expect.soft(dashboard.mainpanel.servicesHeading).toBeVisible()
    await expect
      .soft(dashboard.mainpanel.servicesHeading)
      .toHaveText('Set up services, answer questionnaires, and assign users')
    await expect.soft(dashboard.mainpanel.addCoBtn).toBeVisible()
  }
)

portalTest(
  'Admin can click "Home" button in sidenav',
  async ({ signInAdmin, dashboard, baseURL }) => {
    // click something else first
    await dashboard.sidenav.companiesBtn.click()
    await dashboard.sidenav.homeBtn.click()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await expect(dashboard.page).toHaveURL(baseURL)
    await expect(dashboard.mainpanel.heading).toHaveText(/^Welcome/)
  }
)

portalTest(
  'Admin can click "Companies" button in sidenav @dev',
  async ({ signInAdmin, dashboard, companiesPage }) => {
    await dashboard.sidenav.companiesBtn.click()
    await expect(companiesPage.mainpanel.heading).toHaveText('Companies')
    await expect(companiesPage.cosTable.table).toBeVisible()
  }
)

portalTest(
  'Admin can click "Users" button in sidenav',
  async ({ signInAdmin, dashboard, usersPage }) => {
    // adding a retry because sometimes it hits the ToS
    await expect(async () => {
      await dashboard.sidenav.usersBtn.click()
      await expect(usersPage.page.url()).toMatch(/\/users$/)
    }).toPass()
    await expect(usersPage.mainpanel.heading).toHaveText('Users')
    await expect(usersPage.usersTable.table).toBeVisible()
  }
)

portalTest(
  'Admin can click "Library" button in sidenav',
  async ({ signInAdmin, dashboard, library }) => {
    await dashboard.sidenav.libraryBtn.click()
    await expect(library.mainpanel.heading).toHaveText('Library')
    await expect(library.searchbox.wrapper).toBeVisible()
  }
)

portalTest(
  'Admin can click "Research Hub" button in sidenav',
  async ({ signInAdmin, dashboard }) => {
    await dashboard.sidenav.researchHubBtn.click()
    await expect(dashboard.mainpanel.heading).toHaveText('Research Hub')
  }
)

portalTest(
  'Admin can click "CEO Directory" button in sidenav',
  async ({ signInAdmin, dashboard, ceoDirectory }) => {
    await dashboard.sidenav.ceoDirectoryBtn.click()
    await expect(ceoDirectory.pageHeading).toHaveText('CEO Directory')
    await expect(ceoDirectory.searchbox).toBeVisible()
  }
)

portalTest(
  'Admin cannot see "Vendors" button in sidenav',
  async ({ signInAdmin, dashboard }) => {
    await expect(dashboard.sidenav.vendorsBtn).not.toBeVisible()
  }
)

portalTest(
  'Admin can click "Developer Tools" button in sidenav',
  async ({ signInAdmin, dashboard, developers }) => {
    await dashboard.sidenav.developersBtn.click()
    await expect(developers.mainpanel.heading).toHaveText('Developer Tools')
    await expect(developers.searchbox.wrapper).toBeVisible()
  }
)

portalTest(
  'Admin can click "Support" button in sidenav',
  async ({ signInAdmin, dashboard, supportPage }) => {
    await dashboard.sidenav.supportAndFeedbackBtn.click()
    await expect(supportPage.mainpanel.heading).toHaveText('Support Center')
  }
)

portalTest(
  'Admin can click "View all" link in Companies section @dev',
  async ({ signInAdmin, dashboard, companiesPage }) => {
    await dashboard.mainpanel.viewCompaniesBtn.click()
    await expect(companiesPage.mainpanel.heading).toHaveText('Companies')
    await expect(companiesPage.cosTable.table).toBeVisible()
  }
)

portalTest(
  'Admin can click "View all" link in Users section',
  async ({ signInAdmin, dashboard, usersPage }) => {
    await dashboard.mainpanel.viewAllUsersBtn.click()
    await expect(usersPage.mainpanel.heading).toHaveText('Users')
  }
)

portalTest(
  'Admin can click "Add Company" button in Services section @dev',
  async ({ signInAdmin, dashboard, companiesPage }) => {
    await dashboard.mainpanel.addCoBtn.click()
    await dashboard.page.getByRole('menuitem', { name: 'RH company' }).click()
    await expect(companiesPage.addCoForm.modal).toBeVisible()
    await expect(companiesPage.addCoForm.heading).toHaveText(/^Add Company/)
  }
)

portalTest(
  'Admin can click "Add user" button in Users section',
  async ({ signInAdmin, dashboard }) => {
    await dashboard.mainpanel.addUserBtn.click()
    await expect(dashboard.addUserForm.modal).toBeVisible()
    await expect.soft(dashboard.addUserForm.modal).toHaveScreenshot()
  }
)

portalTest(
  'Add user form has no company pre-selected when opened from dashboard',
  async ({ signInAdmin, dashboard }) => {
    await dashboard.mainpanel.addUserBtn.click()
    await expect(dashboard.addUserForm.modal).toBeVisible()
    await dashboard.addUserForm.adminRB.click()
    await expect(dashboard.addUserForm.companyAssignmentSel.icon).toBeVisible()
    await expect
      .soft(dashboard.addUserForm.companyAssignmentSel.wrapper)
      .toHaveScreenshot('after-clicking-userType.png')
  }
)

portalTest(
  'Add user form Company assignment select has all company options @dev-solo',
  async ({ signInAdmin, dashboard }, testInfo) => {
    const apiUrl = testInfo.config.metadata.apiURL
    const jwt = testInfo.config.metadata.jwt
    const apiContext = await newAPIContext(apiUrl, jwt)
    const resp = await getCompanies(apiContext)
    const json = await resp.json()
    const companyNames = await json.content.map(co => co.name)
    await dashboard.mainpanel.addUserBtn.click()
    await dashboard.addUserForm.adminRB.click()
    await dashboard.addUserForm.companyAssignmentSel.input.click()
    await expect(
      dashboard.addUserForm.companyAssignmentSel.optionsList
    ).toHaveText(companyNames)
  }
)

// TODO
// portalTest('Admin can log out', async ({ adminHome, signinPage }) => {
//   await adminHome.logout()
//   await expect.soft(signinPage.heading).toBeVisible()
//   await expect.soft(signinPage.heading).toHaveText('Sign in')
//   await expect(signinPage.signInWithGoogleBtn).toBeVisible()
// })
