import { mockConsent, mockConsentWithStaleVersion } from './consent'
import { api } from './openapi-msw-setup'

describe('Consent fixtures validation against API contract', () => {
  it('Happy path', () => {
    const valid = api.validateResponse(mockConsent, 'getConsent', 200)
    expect(valid.errors).toBeNull()
  })

  it('with stale version', () => {
    const valid = api.validateResponse(
      mockConsentWithStaleVersion,
      'getConsent',
      200
    )
    expect(valid.errors).toBeNull()
  })
})
