import { expect } from '@playwright/test'
import { portalTest } from '../../../../fixtures/platform-ui-test'

portalTest.describe.configure({ mode: 'parallel' })
portalTest.describe('Add CEO form', () => {
  portalTest('Email is required', async ({ signInAdmin, ceoDirectory }) => {
    await ceoDirectory.addCEOForm.goto()
    await ceoDirectory.addCEOForm.selectUser.control.open()
    await ceoDirectory.addCEOForm.selectUser.label.click()
    await expect
      .soft(ceoDirectory.addCEOForm.selectUser.errors)
      .toHaveText('Required')
    await expect.soft(ceoDirectory.addCEOForm.addCEOBtn).toBeDisabled()
  })

  portalTest(
    'Admin user can click "Add CEO" button',
    async ({ signInAdmin, ceoDirectory }) => {
      await ceoDirectory.goto()
      await ceoDirectory.addCEOBtn.click()
      await expect(ceoDirectory.addCEOForm.heading).toHaveText(/Add/)
    }
  )

  portalTest(
    'RH User cannot see "Add CEO" button',
    async ({ signInRHUser, ceoDirectory }) => {
      await ceoDirectory.addCEOForm.goto()
      expect(await ceoDirectory.addCEOBtn.count()).toBe(0)
    }
  )

  portalTest(
    'Company User cannot see "Add CEO" button',
    async ({ signInCoUser, ceoDirectory }) => {
      await ceoDirectory.addCEOForm.goto()
      expect(await ceoDirectory.addCEOBtn.count()).toBe(0)
    }
  )
})
