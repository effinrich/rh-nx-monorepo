import { QueryObserverSuccessResult } from '@tanstack/react-query'
import { vi } from 'vitest'

import * as hooks from '../hooks'
import { AdvisorList } from '../types'

export const mockUseAllAdvisorsQuery = (
  isPending = false,
  data: AdvisorList = []
) => {
  const mock = vi.fn(
    () => ({ isPending, data } as QueryObserverSuccessResult<AdvisorList>)
  )
  vi.spyOn(hooks, 'useAllAdvisorsQuery').mockImplementation(mock)
}
