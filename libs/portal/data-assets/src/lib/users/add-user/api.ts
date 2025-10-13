import { axiosApi } from '../../axios-api'
import { NewUserProps } from '../types'

export const putUser = async (newUser: NewUserProps) => {
  const { data } = await axiosApi.put(`/person/${newUser.email}`, newUser)

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

export const createProxyCompanyMember = async (newUser: NewUserProps) => {
  await putUser(newUser)
  if (newUser.memberOf)
    return newUser?.memberOf?.map(
      async coId => await putCompanyMember(newUser?.email, coId)
    )
}
