import { axiosApi } from '@redesignhealth/portal/data-assets'

export interface FeedbackProps {
  title: string | undefined
  improvements: string
  comments: string | undefined
}

export const putModuleFeedback = async (
  feedback: FeedbackProps,
  id: string | undefined
) => {
  const { data } = await axiosApi.put(
    `/library-content/${id}/feedback`,
    feedback
  )
  return data
}
