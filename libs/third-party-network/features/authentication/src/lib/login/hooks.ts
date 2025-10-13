import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from './api'

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    retry: false
  })
}
