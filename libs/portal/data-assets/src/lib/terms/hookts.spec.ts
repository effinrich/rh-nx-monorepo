import { setupServer } from 'msw/node'

import {
  mockConsent,
  mockConsentWithStaleVersion,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockRhUser
} from '../mock'

import { hasUserConsented, inferConsentType } from './hooks'

describe('Terms hooks', () => {
  describe('inferConsentType', () => {
    it('returns UNKNOWN if undefined', () => {
      expect(inferConsentType(undefined)).toBe('UNKNOWN')
    })

    it('returns BUYER_TERMS_OF_SERVICE for Marketplace buyer', () => {
      expect(inferConsentType(mockEnterpriseBuyerUser)).toBe(
        'BUYER_TERMS_OF_SERVICE'
      )
    })

    it('returns SELLER_TERMS_OF_SERVICE for Marketplace seller', () => {
      expect(inferConsentType(mockEnterpriseSellerUser)).toBe(
        'SELLER_TERMS_OF_SERVICE'
      )
    })

    it('defaults to TERMS_OF_SERVICE', () => {
      expect(inferConsentType(mockRhUser)).toBe('TERMS_OF_SERVICE')
    })
  })

  describe('hasUserConsented', () => {
    const server = setupServer()
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    it('return true if versions match', async () => {
      expect(hasUserConsented(mockConsent)).toBe(true)
    })

    it('returns false if versions do not match', async () => {
      expect(hasUserConsented(mockConsentWithStaleVersion)).toBe(false)
    })

    it('returns false if getMeConsent returns 404', async () => {
      expect(hasUserConsented(null)).toBe(false)
    })
  })
})
