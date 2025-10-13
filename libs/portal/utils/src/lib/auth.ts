import { redirect } from 'react-router-dom'

const USER_ACCESS_TOKEN_KEY = 'userAccessToken'
const CURRENT_USER_ROLE = 'currentUserRole'
const IMPERSONATED_EMAIL = 'impersonatedEmail'

interface UserInfo {
  role?: {
    authority: string
  }
}

interface CompanyOption {
  id: string
}
/** Returns user token from local storage for authenticated api calls. */
export const getUserAccessToken = () => {
  return localStorage.getItem(USER_ACCESS_TOKEN_KEY)
}

/** Store user token in local storage */
export const setUserAccessToken = (userAccessToken: string) => {
  localStorage.setItem(USER_ACCESS_TOKEN_KEY, userAccessToken)
}

/** Store impersonated email token in local storage */
export const setImpersonatedEmail = (impersonatedEmail: string) => {
  localStorage.setItem(IMPERSONATED_EMAIL, impersonatedEmail)
}

/** Returns impersonated email token from local storage for authenticated api calls. */
export const getImpersonatedEmail = () => {
  return localStorage.getItem(IMPERSONATED_EMAIL)
}

/** Removes impersonated email token from local storage for authenticated api calls. */
export const unsetImpersonatedEmail = () => {
  localStorage.removeItem(IMPERSONATED_EMAIL)
}

/** Delete user token from local storage, user role from local storage and queryClient cache */
export const logout = (callback?: VoidFunction) => {
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY)
  localStorage.removeItem(CURRENT_USER_ROLE)
  localStorage.removeItem(IMPERSONATED_EMAIL)
  callback && callback()
}

/** Store current user role in local storage */
export const setCurrentUserRole = (currentUserRole: string) => {
  localStorage.setItem(CURRENT_USER_ROLE, currentUserRole)
}

/** Get current user role in local storage */
export const getCurrentUserRole = () => {
  return localStorage.getItem(CURRENT_USER_ROLE)
}

/* Returns a response that you can return in loader in case user is not logged in. */
export const requireLogin = () => {
  const userAccessToken = getUserAccessToken()
  if (userAccessToken) return null

  return redirect('/sign-in')
}

export const getUserInfo = (
  userInfo: UserInfo,
  companyOptions: CompanyOption[]
) => {
  const rolesIncludeOpCoUser = userInfo?.role?.authority === 'ROLE_OP_CO_USER'
  const userCompanyId = companyOptions?.[0]?.id
  return { rolesIncludeOpCoUser, userCompanyId }
}

export const redirectToOpCoPage = (
  userInfo: UserInfo,
  companyOptions: CompanyOption[]
) => {
  const { rolesIncludeOpCoUser, userCompanyId } = getUserInfo(
    userInfo,
    companyOptions
  )
  return rolesIncludeOpCoUser && userCompanyId
}

export const redirectToLibrary = (
  userInfo: UserInfo,
  companyOptions: CompanyOption[]
) => {
  const { rolesIncludeOpCoUser, userCompanyId } = getUserInfo(
    userInfo,
    companyOptions
  )
  return rolesIncludeOpCoUser && !userCompanyId
}

/** Returns a url based on the `redirectTo` search param and remaining params.*/
export const getRedirectURLString = (request: Request) => {
  /* Sign in will throw 401 if the impersonation header is not null */
  localStorage.removeItem(IMPERSONATED_EMAIL)
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)

  // default to home page if no redirectTo provided
  const redirectTo = params.get('redirectTo') ?? '/'

  // remove redirectTo from remaining params
  params.delete('redirectTo')

  const searchParams = params.toString()

  if (!searchParams) return redirectTo

  return `${redirectTo}?${searchParams.toString()}`
}
