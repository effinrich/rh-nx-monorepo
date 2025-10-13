import {
  type CompanyCommand,
  type CompanySummary,
  axiosApi
} from '@redesignhealth/portal/data-assets'

export interface ConflictsProps {
  links?: string[]
  content: CompanySummary[]
}

export const getCompanyByIdFormFriendly: (
  id?: string
) => Promise<CompanyCommand> = async (id?: string) => {
  const companyData = await getCompanyById(id)
  const conflictsData = await getConflictsByCompanyId(id)
  const conflicts = conflictsData?.content.map(conflict => {
    return {
      label: conflict.name,
      value: conflict.id
    }
  })

  const companyCommand: CompanyCommand = {
    ...companyData,
    conflicts,
    fundraiseStatus: companyData.fundraiseStatus?.value,
    // we need access to the lowest level taxonomy term
    taxonomy: companyData.taxonomy?.find(t => t.level === 3)?.value,
    activityType: companyData.activityType?.value,
    organizationType: companyData.organizationType?.value,
    region: companyData.region?.value
  }

  if (!companyData.linkedApiId) {
    return companyCommand
  }

  const linkedCompanyData = await getCompanyById(companyData.linkedApiId)

  if (linkedCompanyData.stage === 'CONCEPT') {
    const concept = {
      label: linkedCompanyData.name,
      value: linkedCompanyData.id
    }
    return { ...companyCommand, concept }
  }

  if (linkedCompanyData.stage === 'THEME') {
    const theme = {
      label: linkedCompanyData.name,
      value: linkedCompanyData.id
    }
    return { ...companyCommand, theme }
  }

  throw new Error(
    `${linkedCompanyData.name} has unexpected stage ${linkedCompanyData.stage}`
  )
}

export const getCompanyById = async (id?: string) => {
  const { data } = await axiosApi.get<CompanySummary>(`/company/${id}`)

  return data
}

export const getConflictsByCompanyId = async (companyId?: string) => {
  const { data } = await axiosApi.get<ConflictsProps>(
    `/company/${companyId}/conflicts`
  )

  return data
}
