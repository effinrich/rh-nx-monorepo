import { companyAPI } from '@redesignhealth/third-party-network/data-assets'

import { CurrentUser } from './types'

export const getCurrentUser = async () => {
  interface CurrentUserResponse {
    givenName?: string
    familyName?: string
    email: string
  }

  const { data } = await companyAPI.get<CurrentUserResponse>('/userinfo')

  const currentUser: CurrentUser = {
    firstName: data.givenName,
    lastName: data.familyName,
    email: data.email
  }

  return currentUser
}
