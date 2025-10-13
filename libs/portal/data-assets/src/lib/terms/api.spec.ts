import { setupServer } from 'msw/node'

import { mockGetMeConsentNotFound, mockGetMeConsentServerError } from '../mock'

import { getMeConsent } from './api'

describe('Consent API', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('getMeConsent', () => {
    it('returns null on 404', async () => {
      mockGetMeConsentNotFound(server)
      expect(await getMeConsent('TERMS_OF_SERVICE')).toBe(null)
    })

    it('throws error on 500', () => {
      mockGetMeConsentServerError(server)
      return expect(getMeConsent('TERMS_OF_SERVICE')).rejects.toThrowError()
    })
  })
})
