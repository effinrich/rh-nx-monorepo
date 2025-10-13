import * as auth from '@redesignhealth/third-party-network/features/authentication'
import { QueryObserverSuccessResult } from '@tanstack/react-query'
import { vi } from 'vitest'

import * as hooks from '../hooks'
import { Advisor, OpcoEngagement } from '../types'

export const mockUseOpcoEngagementsQuery = (
  isPending = false,
  data: Array<OpcoEngagement> = []
) => {
  const mock = vi.fn(
    () => ({ isPending, data } as QueryObserverSuccessResult<OpcoEngagement[]>)
  )
  vi.spyOn(hooks, 'useOpcoEngagementsQuery').mockImplementation(mock)
}

export const mockUseAdvisorQuery = (isPending = false, data: Advisor = {}) => {
  const mock = vi.fn(
    () => ({ isPending, data } as QueryObserverSuccessResult<Advisor>)
  )
  vi.spyOn(hooks, 'useAdvisorQuery').mockImplementation(mock)
}

export const mockUseCurrentUserQuery = (isPending = false, data = {}) => {
  const mock = vi.fn(
    () => ({ isPending, data } as QueryObserverSuccessResult<object>)
  )
  vi.spyOn(auth, 'useCurrentUserQuery').mockImplementation(mock)
}
