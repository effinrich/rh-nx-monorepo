import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import { ConsentSummary } from '../../terms/types'

export const mockGetMeConsentNotFound = (server: SetupServer) =>
  server.use(rest.get('/me/consent/*', (req, res, ctx) => res(ctx.status(404))))

export const mockGetMeConsentServerError = (server: SetupServer) =>
  server.use(rest.get('/me/consent/*', (req, res, ctx) => res(ctx.status(500))))

export const mockGetMeConsent = (
  server: SetupServer,
  consent: ConsentSummary
) =>
  server.use(
    rest.get('/me/consent/*', (req, res, ctx) => res(ctx.json(consent)))
  )
