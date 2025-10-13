import { useMutation } from '@tanstack/react-query'

import { createIntroductionRequest } from './api'

export const useIntroductionRequestMutation = () => {
  return useMutation({ mutationFn: createIntroductionRequest })
}
