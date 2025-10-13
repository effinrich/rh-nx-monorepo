import { UseMutationResult } from '@tanstack/react-query'
import { vi } from 'vitest'

import { CreateIntroductionRequest } from '../api'
import * as hooks from '../hooks'

export const mockUseIntroductionRequestMutation = () => {
  const mock = vi.fn(
    () => ({} as UseMutationResult<void, Error, CreateIntroductionRequest>)
  )
  vi.spyOn(hooks, 'useIntroductionRequestMutation').mockImplementation(mock)
}
