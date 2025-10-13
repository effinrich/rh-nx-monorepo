import { rest } from 'msw'

import { ceo } from './ceo'
import { person } from './person'
import { userInfo } from './userinfo'

export const registerMockEndpoints = () => [
  rest.get('/ceos/6nuT80li', (req, res, ctx) => {
    return res(ctx.json(ceo))
  }),
  rest.get('/userinfo', (req, res, ctx) => {
    return res(ctx.json(userInfo))
  }),
  rest.get('/person/sazh.katzroy@redesignhealth.com', (req, res, ctx) => {
    return res(ctx.json(person))
  })
]
