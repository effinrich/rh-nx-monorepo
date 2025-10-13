const USER_ACCESS_TOKEN_KEY = 'USER_ACCESS_TOKEN'

export const setUserAccessToken = (accessToken: string) => {
  localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken)
}

export const getUserAccessToken = () => {
  return localStorage.getItem(USER_ACCESS_TOKEN_KEY)
}

export const removeUserAccessToken = () => {
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY)
}
