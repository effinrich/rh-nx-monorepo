import { axiosApi } from '@redesignhealth/portal/data-assets'

export interface NewUserProps {
  givenName?: string
  familyName?: string
  email?: string
  memberOf?: string[]
  role?: string
}

export const putUser = async (newUser: NewUserProps) => {
  const { data } = await axiosApi.put(`/person/${newUser['email']}`, newUser)

  return data
}

export const putCompanyMember = async (
  email: NewUserProps['email'],
  companyId: string | undefined
) => {
  const { data } = await axiosApi.put(`/company/${companyId}/member/${email}`, {
    status: 'ACTIVE'
  })
  return data
}

export const createPretendProxyCompanyMember = async (
  newUser: NewUserProps
) => {
  await putUser(newUser)
  if (newUser.memberOf)
    return newUser?.memberOf?.map(
      async coId => await putCompanyMember(newUser?.email, coId)
    )
}
