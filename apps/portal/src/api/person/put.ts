import {
  EntityModelMapObjectObject,
  PersonCommand,
  PersonSummary
} from '@redesignhealth/company-api-types'
import { axiosApi } from '@redesignhealth/portal/data-assets'
import { parseRequest } from '@redesignhealth/portal/utils'

export const updatePerson = async (
  email: PersonSummary['email'],
  body: PersonCommand
) => {
  const { error, response } = await parseRequest<PersonSummary>(
    axiosApi.put(`/person/${email}`, body)
  )

  if (error) throw error
  return response.data
}

export const addPersonRole = async (
  email: PersonSummary['email'],
  authority: NonNullable<PersonSummary['roles']>[number]['authority']
) => {
  const { error, response } = await parseRequest<EntityModelMapObjectObject>(
    axiosApi.put(`/person/${email}/role/${authority}`)
  )

  if (error) throw error
  return response.data
}
