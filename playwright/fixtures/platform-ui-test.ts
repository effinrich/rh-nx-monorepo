import { test as base } from '@playwright/test'

import { PLATFORM_USERS } from '../data/platform/users'
import { AddCompanyForm } from '../pages/platform-portal/dashboard/companies/add-company.form'
import { CompaniesPage } from '../pages/platform-portal/dashboard/companies/companies.page'
import { CompanyPage } from '../pages/platform-portal/dashboard/companies/company-details/company.page'
import { Dashboard } from '../pages/platform-portal/dashboard/dashboard.page'
import { DevelopersPage } from '../pages/platform-portal/developers.page'
import { LibraryPage } from '../pages/platform-portal/library.page'
import { SignInPage } from '../pages/platform-portal/signin.page'
import { SuccessPage } from '../pages/platform-portal/success.page'
import { SupportPage } from '../pages/platform-portal/support.page'
import { UsersPage } from '../pages/platform-portal/dashboard/users/users.page'
import { ResearchHubPage } from '../pages/platform-portal/researchHub/researchHub.page'
import { Directory } from '../pages/platform-portal/dashboard/ceo/directory.page'
import { Onboarding } from '../pages/platform-portal/dashboard/ceo/onboarding.page'
import { Profile } from '../pages/platform-portal/dashboard/ceo/profile.page'

export type portalPages = {
  dashboard: Dashboard
  ceoDirectory: Directory
  ceoOnboarding: Onboarding
  ceoProfile: Profile
  companiesPage: CompaniesPage
  companyPage: CompanyPage
  addCoForm: AddCompanyForm
  signinPage: SignInPage
  signInAdmin: Dashboard
  signInCoUser: CompanyPage
  signInRHUser: Dashboard
  successPage: SuccessPage
  supportPage: SupportPage
  usersPage: UsersPage
  coPage: CompanyPage
  library: LibraryPage
  researchHub: ResearchHubPage
  developers: DevelopersPage
}

/**
 * Work around Google ID authentication issues related to being a robot, by
 * setting JWT in localstorage directly.
 *
 * Also supports impersonation.
 */
async function initPage(page, user) {
  await page.addInitScript(
    ({ jwt, user }) => {
      const USER_ACCESS_TOKEN_LOCALSTORAGE_KEY = 'userAccessToken'
      const IMPERSONATED_EMAIL_LOCALSTORAGE_KEY = 'impersonatedEmail'

      window.localStorage.setItem(USER_ACCESS_TOKEN_LOCALSTORAGE_KEY, jwt)
      if (user && user.authority !== 'ROLE_SUPER_ADMIN') {
        window.localStorage.setItem(
          IMPERSONATED_EMAIL_LOCALSTORAGE_KEY,
          user.email
        )
      }
    },
    { jwt: process.env.JWT, user }
  )
  await page.goto('/')
}

export const portalTest = base.extend<portalPages>({
  addCoForm: async ({ page }, use) => {
    use(new AddCompanyForm(page))
  },
  companiesPage: async ({ page }, use) => {
    const AllCosPage = new CompaniesPage(page)
    await use(AllCosPage)
  },
  ceoDirectory: async ({ page }, use) => {
    const ceoDirectory = new Directory(page)
    await use(ceoDirectory)
  },
  ceoOnboarding: async ({ page }, use) => {
    const ceoOnboarding = new Onboarding(page)
    await use(ceoOnboarding)
  },
  ceoProfile: async ({ page }, use) => {
    const ceoProfile = new Profile(page)
    await use(ceoProfile)
  },
  coPage: async ({ page }, use) => {
    const coPage = new CompanyPage(page)
    await use(coPage)
  },
  dashboard: async ({ page }, use) => {
    const dashboard = new Dashboard(page)
    await use(dashboard)
  },
  library: async ({ page }, use) => {
    const library = new LibraryPage(page)
    await use(library)
  },
  researchHub: async ({ page }, use) => {
    const research = new ResearchHubPage(page)
    await use(research)
  },
  developers: async ({ page }, use) => {
    const developers = new DevelopersPage(page)
    await use(developers)
  },
  signInAdmin: async ({ page }, use) => {
    await initPage(page, PLATFORM_USERS.admin)
    const dashboard = new Dashboard(page)
    await use(dashboard)
  },
  signInRHUser: async ({ page }, use) => {
    await initPage(page, PLATFORM_USERS.rhUser)
    const dashboard = new Dashboard(page)
    await use(dashboard)
  },
  signInCoUser: async ({ page }, use) => {
    await initPage(page, PLATFORM_USERS.coUser)
    const coPage = new CompanyPage(page)
    await use(coPage)
  },
  signinPage: async ({ page }, use) => {
    const signinPage = new SignInPage(page)
    await use(signinPage)
  },
  successPage: async ({ page }, use) => {
    const successPage = new SuccessPage(page)
    await use(successPage)
  },
  supportPage: async ({ page }, use) => {
    const supportPage = new SupportPage(page)
    await use(supportPage)
  },
  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page)
    await use(usersPage)
  }
})
