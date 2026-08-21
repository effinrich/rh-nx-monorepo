import { http, HttpResponse } from 'msw'

import { ceo } from './ceo'
import { person } from './person'
import { userInfo } from './userinfo'

export const registerMockEndpoints = () => [
  http.get('/ceos/6nuT80li', () => {
    return HttpResponse.json(ceo)
  }),
  http.get('/userinfo', () => {
    return HttpResponse.json(userInfo)
  }),
  http.get('/person/sazh.katzroy@redesignhealth.com', () => {
    return HttpResponse.json(person)
  })
]
