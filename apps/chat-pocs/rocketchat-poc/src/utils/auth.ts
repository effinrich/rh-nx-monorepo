/** Returns user tokens from local storage for authenticated api calls. */

const ACCESS_TOKEN_KEY = 'accessToken'
const ID_TOKEN_KEY = 'idToken'
const TOKENS_KEY = 'tokens'

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/** Store access token in local storage */
export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export const getIdToken = () => {
  return localStorage.getItem(ID_TOKEN_KEY)
}

/** Store id token in local storage */
export const setIdToken = (idToken: string) => {
  localStorage.setItem(ID_TOKEN_KEY, idToken)
}

export const setTokens = (tokens: string) => {
  localStorage.setItem(TOKENS_KEY, tokens)
}

export const getTokens = () => {
  const tokensString = localStorage.getItem(TOKENS_KEY)

  //if (!tokensString) {
  //  throw new Response('', { status: 401 })
  //}

  return JSON.parse(tokensString as string)
}
