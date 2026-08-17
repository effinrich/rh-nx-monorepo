import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { ConsentSummary } from '../../terms/types'

export const mockGetMeConsentNotFound = (server: SetupServer) =>
  server.use(http.get('/me/consent/*', () => new HttpResponse(null, { status: 404 })))

export const mockGetMeConsentServerError = (server: SetupServer) =>
  server.use(http.get('/me/consent/*', () => new HttpResponse(null, { status: 500 })))

export const mockGetMeConsent = (
  server: SetupServer,
  consent: ConsentSummary
) =>
  server.use(
    http.get('/me/consent/*', () => HttpResponse.json(consent))
  )
