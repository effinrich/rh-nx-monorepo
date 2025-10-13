import {
  mockMarketplaceBuyerCompany,
  mockMarketplaceSellerCompany,
  mockRhOpCoCompany,
  mockRhThemeCompany
} from './company'
import { api } from './openapi-msw-setup'

describe('Company fixtures validation against API contract', () => {
  describe('Get company', () => {
    it('RH OpCo company', () => {
      const valid = api.validateResponse(mockRhOpCoCompany, 'get_5', 200)
      expect(valid.errors).toBeNull()
    })
    it('RH Theme company', () => {
      const valid = api.validateResponse(mockRhThemeCompany, 'get_5', 200)
      expect(valid.errors).toBeNull()
    })
    it('Marketplace seller company', () => {
      const valid = api.validateResponse(
        mockMarketplaceSellerCompany,
        'get_5',
        200
      )
      expect(valid.errors).toBeNull()
    })
    it('Marketplace buyer company', () => {
      const valid = api.validateResponse(
        mockMarketplaceBuyerCompany,
        'get_5',
        200
      )
      expect(valid.errors).toBeNull()
    })
  })
})
