import { createRequest } from '@redesignhealth/third-party-network/data-assets'

export interface CreateIntroductionRequest {
  advisorId: string
  advisorName: string
  requesterName: string
  requesterEmail: string
  additionalEmails?: string
  opcoName: string
  opcoDescription: string
}

export const createIntroductionRequest = async (
  request: CreateIntroductionRequest
) => {
  const { advisorName, advisorId, ...requestData } = request
  await createRequest({
    ...requestData,
    parent: advisorId,
    summary: `${advisorName} - ${requestData.requesterName}`
  })
}
