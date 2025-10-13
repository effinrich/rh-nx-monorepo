import { axiosApi } from '../../axios-api'
import { PersonSummary } from '../../types'
import { putCompanyMember } from '../api'

export interface EditUserProps {
  givenName?: string
  familyName?: string
  email?: string
  memberOf?: string[] | undefined
  role?: string
  deletedOpCoIds?: (string | undefined)[] | undefined
}

export const getUserByEmail = async (email: EditUserProps['email']) => {
  const { data } = await axiosApi.get<PersonSummary>(`/person/${email}`)

  return data
}

export const putUpdatedUserRole = async (updatedUser: EditUserProps) => {
  const { data } = await axiosApi.put(
    `/person/${updatedUser.email}/role/${updatedUser.role}`
  )

  return data
}

export const putUser = async (updatedUser: EditUserProps) => {
  const { data } = await axiosApi.put(
    `/person/${updatedUser['email']}`,
    updatedUser
  )

  return data
}

export const deleteUserFromCompany = async (
  email: EditUserProps['email'],
  companyId: string | undefined
) => {
  const { data } = await axiosApi.delete(
    `/company/${companyId}/member/${email}`
  )

  return data
}

export const createEditCompanyMember = async (user: EditUserProps) => {
  await putUser(user)

  if (user.role) await putUpdatedUserRole(user)

  if (user['deletedOpCoIds']) {
    await user['deletedOpCoIds'].map(
      async coId => await deleteUserFromCompany(user.email, coId)
    )
  }

  if (user?.memberOf) {
    for (const coId of user.memberOf) {
      await putCompanyMember(user?.email, coId)
    }
  }

  return { pretendProxyStatus: 'OK' }
}
