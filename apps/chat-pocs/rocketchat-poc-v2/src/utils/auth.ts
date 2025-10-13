/** Returns user tokens from local storage for authenticated api calls. */

const ACCESS_TOKEN_KEY = 'accessToken'
const ID_TOKEN_KEY = 'idToken'
const USER_INFO = 'userInfo'
const REFRESH_TOKEN_KEY = 'refreshToken'
const EXPIRY_DATE = 'expiryDate'

interface TokensProps {
  access_token: string
  id_token: string
  refresh_token: string
  expiry_date: string
}

/** Store access token in local storage */
export const setAccessToken = (accessToken: string) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setRefreshToken = (refreshToken: string) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setUserInfo = (userInfo: object) =>
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo))

export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO)

  if (!userInfo) {
    return null
  }

  return JSON.parse(userInfo)
}

/** Store id token in local storage */
export const setIdToken = (idToken: string) =>
  localStorage.setItem(ID_TOKEN_KEY, idToken)

export const getIdToken = () => localStorage.getItem(ID_TOKEN_KEY)

export const setExpiryDate = (expiryDate: string) =>
  localStorage.setItem(EXPIRY_DATE, expiryDate)

export const getExpiryDate = () => localStorage.getItem(EXPIRY_DATE)

export const setTokens = ({
  access_token,
  id_token,
  refresh_token,
  expiry_date
}: TokensProps) => {
  setAccessToken(access_token)
  setIdToken(id_token)
  setRefreshToken(refresh_token)
  setExpiryDate(expiry_date)
}
