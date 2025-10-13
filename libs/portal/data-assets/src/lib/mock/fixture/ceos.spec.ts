import {
  mockCeoFilters,
  mockCeoOptIn,
  mockCeoOptOut,
  mockCeos,
  mockCeosNoResults
} from './ceos'
import { api } from './openapi-msw-setup'

describe('CEOs fixtures validation against API contract', () => {
  describe('Get CEOs', () => {
    it('Happy path', () => {
      const valid = api.validateResponse(mockCeos, 'getCeos', 200)
      expect(valid.errors).toBeNull()
    })
    it('No results', () => {
      const valid = api.validateResponse(mockCeosNoResults, 'getCeos', 200)
      expect(valid.errors).toBeNull()
    })
  })
  describe('Get CEO by ID', () => {
    it('Opt In', () => {
      const valid = api.validateResponse(mockCeoOptIn, 'get_6', 200)
      expect(valid.errors).toBeNull()
    })

    it('Opt Out', () => {
      const valid = api.validateResponse(mockCeoOptOut, 'get_6', 200)
      expect(valid.errors).toBeNull()
    })
  })

  describe('Get CEO filters', () => {
    it('Happy path', () => {
      const valid = api.validateResponse(mockCeoFilters, 'getFilters_3', 200)
      expect(valid.errors).toBeNull()
    })
  })
})
