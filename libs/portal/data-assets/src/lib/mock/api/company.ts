import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { CompanySummary } from '../../companies'
import { PersonSummary } from '../../types'

export const mockGetCompany = (server: SetupServer, company: CompanySummary) =>
  server.use(
    http.get('/company/:companyId', () => HttpResponse.json(company))
  )

export const mockGetCompanyMembers = (
  server: SetupServer,
  members: PersonSummary[]
) =>
  server.use(
    http.get('/company/:companyId/members', () =>
      HttpResponse.json({ content: members })
    )
  )
