import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { Ceo } from '../../ceo-directory/types'
import { Filters, PagedResult } from '../../types'

export const mockGetCeoById = (server: SetupServer, ceo: Ceo) =>
  server.use(http.get('/ceos/*', () => HttpResponse.json(ceo)))

export const mockGetCeos = (server: SetupServer, ceos: PagedResult<Ceo>) =>
  server.use(http.get('/ceos', () => HttpResponse.json(ceos)))

export const mockGetCeosFilters = (server: SetupServer, filters: Filters) =>
  server.use(
    http.get('/ceos/filters', () => HttpResponse.json(filters))
  )
