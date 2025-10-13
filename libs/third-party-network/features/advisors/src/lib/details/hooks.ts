import { useQuery } from '@tanstack/react-query'

import { getAdvisor, getOpcoEngagements } from './api'

export const useAdvisorQuery = (advisorId: string) => {
  return useQuery({
    queryKey: ['advisor', advisorId],
    queryFn: () => getAdvisor(advisorId)
  })
}

export const useOpcoEngagementsQuery = (
  advisorId: string,
  opcoName: string
) => {
  return useQuery({
    queryKey: ['opco-engagement', advisorId, opcoName],
    queryFn: () => getOpcoEngagements(advisorId, opcoName)
  })
}
