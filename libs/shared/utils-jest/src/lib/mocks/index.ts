import { axiosMock } from './axios-mock'
import { mockCookieStorage } from './cookie'
import { mockImage } from './image'
import { mockLocalStorage } from './localstorage'
import { mockMatchMedia } from './match-media'

export const mocks = {
  axios: axiosMock,
  image: mockImage,
  cookie: mockCookieStorage,
  localStorage: mockLocalStorage,
  matchMedia: mockMatchMedia
}
