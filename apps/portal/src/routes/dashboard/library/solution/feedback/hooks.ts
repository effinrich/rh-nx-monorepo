import { ApiError } from '@redesignhealth/portal/data-assets'
import { getUserAccessToken } from '@redesignhealth/portal/utils'
import { base64urlToBase64 } from '@redesignhealth/shared-utils'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { type FeedbackProps, putModuleFeedback } from './api'

export const usePutFeedbackMutation = () => {
  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (args: { feedback: FeedbackProps; id: string | undefined }) => {
      const feedbackWithSource = addSource(args.feedback)
      return putModuleFeedback(feedbackWithSource, args.id)
    },
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess(updated) {
      return updated
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
function addSource(feedback: FeedbackProps) {
  const url = window.location.href
  const userAccessToken = getUserAccessToken()
  if (!userAccessToken) {
    throw new Error("Can't find userAccessToken before submitting feedback")
  }
  const id = userAccessToken.split('.')[1]
  const tokenB64 = base64urlToBase64(id)
  // We don't care that Node thinks atob() is deprecated
  const tokenJson = atob(tokenB64)
  const jwt = JSON.parse(tokenJson)
  const email = jwt.email || 'unknown.user@example.org'
  const source = ` -- Submitted by ${email} from ${url}`
  if (feedback.comments) {
    feedback.comments += source
  } else {
    feedback.comments = source
  }
  return feedback
}
