// import { QueryClient } from '@tanstack/react-query'

const USER_TOKEN_KEY = 'userToken'

// const queryClient = new QueryClient()
/** Returns user token from local storage for authenticated api calls. */
export const setUserToken = (userToken: string) => {
  return localStorage.setItem(USER_TOKEN_KEY, userToken)
}

/** Returns user token from local storage for authenticated api calls. */
export const getUserToken = () => {
  return localStorage.getItem(USER_TOKEN_KEY)
}

/** Returns user token from local storage for authenticated api calls. */
export const removeUserToken = () => {
  return localStorage.removeItem(USER_TOKEN_KEY)
}

/** Delete user token from local storage, user role from local storage and queryClient cache */
export const logout = (callback: VoidFunction) => {
  localStorage.removeItem(USER_TOKEN_KEY)
  // googleLogout()
  callback()
}
