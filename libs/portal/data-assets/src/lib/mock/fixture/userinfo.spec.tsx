import { api } from './openapi-msw-setup'
import {
  mockAdminUser,
  mockCEOCompanyUser,
  mockCompanyUser,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockRhUser,
  mockSuperAdminUser
} from './userinfo'

describe('UserInfo fixtures validation against API contract', () => {
  describe('Get UserInfo', () => {
    it('Super Admin user', () => {
      const valid = api.validateResponse(mockSuperAdminUser, 'getUserInfo', 200)
      expect(valid.errors).toBeNull()
    })

    it('Admin user', () => {
      const valid = api.validateResponse(mockAdminUser, 'getUserInfo', 200)
      expect(valid.errors).toBeNull()
    })

    it('RH User', () => {
      const valid = api.validateResponse(mockRhUser, 'getUserInfo', 200)
      expect(valid.errors).toBeNull()
    })

    it('Company user', () => {
      const valid = api.validateResponse(mockCompanyUser, 'getUserInfo', 200)
      expect(valid.errors).toBeNull()
    })

    it('CEO Company User', () => {
      const valid = api.validateResponse(mockCEOCompanyUser, 'getUserInfo', 200)
      expect(valid.errors).toBeNull()
    })

    it('Enterprise Buyer User', () => {
      const valid = api.validateResponse(
        mockEnterpriseBuyerUser,
        'getUserInfo',
        200
      )
      expect(valid.errors).toBeNull()
    })

    it('Enterprise Seller User', () => {
      const valid = api.validateResponse(
        mockEnterpriseSellerUser,
        'getUserInfo',
        200
      )
      expect(valid.errors).toBeNull()
    })
  })
})
