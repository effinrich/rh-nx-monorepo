import { useQuery } from '@tanstack/react-query'

import { getCompanyById, getConflictsByCompanyId } from './api'
/**
 * TODO: We need to fix up our react-query keys logic before using this hook.
 * After the first fetch and edit, the data WILL NOT update unless there's a hard refresh.
 * I tried the various react-query options to kill cache or set cache for 500ms, invalidate all querys,
 * but nothing worked.
 */
export const useGetCompanyById = (id?: string) => {
  const { data: companyData } = useQuery({
    queryKey: ['company', 'company-list', id],
    queryFn: () => getCompanyById(id)
  })

  const {
    data: conflictsData,
    isPending,
    isSuccess
  } = useQuery({
    queryKey: ['company', 'company-list', id, 'conflicts'],
    queryFn: () => getConflictsByCompanyId(id),
    enabled: !!companyData
  })

  const selectedConflicts = conflictsData?.content.map(conflict => {
    return {
      label: conflict.name,
      value: conflict.id
    }
  })

  const data = {
    ...companyData,
    conflicts: selectedConflicts,
    fundraiseStatus: companyData?.fundraiseStatus?.value
  }

  return { data, isPending, isSuccess }
}
