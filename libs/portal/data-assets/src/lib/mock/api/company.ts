import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import { CompanySummary } from '../../companies'
import { PersonSummary } from '../../types'

export const mockGetCompany = (server: SetupServer, company: CompanySummary) =>
  server.use(
    rest.get('/company/:companyId', (req, res, ctx) => res(ctx.json(company)))
  )

export const mockGetCompanyMembers = (
  server: SetupServer,
  members: PersonSummary[]
) =>
  server.use(
    rest.get('/company/:companyId/members', (req, res, ctx) =>
      res(ctx.json({ content: members }))
    )
  )
