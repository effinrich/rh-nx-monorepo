import {
  mockIpListingWithMetrics,
  mockIpListingWithOwner,
  mockIpListingWithReleasedIPRequest,
  mockIpListingWithRequests,
  mockIpMarketplaceContactInfo,
  mockIpMarketplaceFilters,
  mockIpMarketplaceNoResults,
  mockIpMarketplaceWithMetrics,
  mockIpMarketplaceWithRequests
} from './ip-marketplace'
import { api } from './openapi-msw-setup'

describe('IP Marketplace fixtures validation against API contract', () => {
  describe('Get IPs', () => {
    it('with metrics', () => {
      const valid = api.validateResponse(
        mockIpMarketplaceWithMetrics,
        'getIpRecords',
        200
      )
      expect(valid.errors).toBeNull()
    })

    it('with requests', () => {
      const valid = api.validateResponse(
        mockIpMarketplaceWithRequests,
        'getIpRecords',
        200
      )
      expect(valid.errors).toBeNull()
    })

    it('no results', () => {
      const valid = api.validateResponse(
        mockIpMarketplaceNoResults,
        'getIpRecords',
        200
      )
      expect(valid.errors).toBeNull()
    })
  })

  describe('Get IP Listing', () => {
    it('with owner', () => {
      const valid = api.validateResponse(mockIpListingWithOwner, 'get_2', 200)
      expect(valid.errors).toBeNull()
    })
    it('with metrics', () => {
      const valid = api.validateResponse(mockIpListingWithMetrics, 'get_2', 200)
      expect(valid.errors).toBeNull()
    })

    it('with requests', () => {
      const valid = api.validateResponse(
        mockIpListingWithRequests,
        'get_2',
        200
      )
      expect(valid.errors).toBeNull()
    })
    it('with released IP request', () => {
      const valid = api.validateResponse(
        mockIpListingWithReleasedIPRequest,
        'get_2',
        200
      )
      expect(valid.errors).toBeNull()
    })
    it('with unreleased IP request', () => {
      const valid = api.validateResponse(
        mockIpListingWithRequests,
        'get_2',
        200
      )
      expect(valid.errors).toBeNull()
    })
  })

  describe('Get IP Filters', () => {
    it('Happy path', () => {
      const valid = api.validateResponse(
        mockIpMarketplaceFilters,
        'getFilter',
        200
      )
      expect(valid.errors).toBeNull()
    })
  })

  describe('Me PUT IP Contact Info', () =>
    it('Happy path', () => {
      const valid = api.validateResponse(
        mockIpMarketplaceContactInfo,
        'processContactInfo',
        200
      )
      expect(valid.errors).toBeNull()
    }))
})
