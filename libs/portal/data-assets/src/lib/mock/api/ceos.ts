import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import { Ceo } from '../../ceo-directory/types'
import { Filters, PagedResult } from '../../types'

export const mockGetCeoById = (server: SetupServer, ceo: Ceo) =>
  server.use(rest.get('/ceos/*', (req, res, ctx) => res(ctx.json(ceo))))

export const mockGetCeos = (server: SetupServer, ceos: PagedResult<Ceo>) =>
  server.use(rest.get('/ceos', (req, res, ctx) => res(ctx.json(ceos))))

export const mockGetCeosFilters = (server: SetupServer, filters: Filters) =>
  server.use(
    rest.get('/ceos/filters', (req, res, ctx) => res(ctx.json(filters)))
  )
