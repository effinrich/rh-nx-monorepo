import {
  InfraRequestCommandStatusEnum,
  InfraRequestSummary,
  RequestFormCommandStatusEnum,
  RequestFormSummary
} from '@redesignhealth/company-api-types'

export const getIsFormSubmissionPending = (
  privacyFormStatus: RequestFormSummary['status']['value'],
  techStackFormStatus: RequestFormSummary['status']['value']
) => {
  return (
    privacyFormStatus === RequestFormCommandStatusEnum['Draft'] ||
    privacyFormStatus === RequestFormCommandStatusEnum['Completed'] ||
    techStackFormStatus === RequestFormCommandStatusEnum['Draft'] ||
    techStackFormStatus === RequestFormCommandStatusEnum['Completed']
  )
}

export const getIsInfraRequestSubmitted = (
  infraRequestStatus: InfraRequestSummary['status']['value']
) => {
  return (
    infraRequestStatus === InfraRequestCommandStatusEnum['Pending'] ||
    infraRequestStatus === InfraRequestCommandStatusEnum['Done'] ||
    infraRequestStatus === InfraRequestCommandStatusEnum['InProgress']
  )
}

export const getForms = (
  infraRequest?: InfraRequestSummary | null | undefined
) => {
  return {
    privacyForm: infraRequest?.forms?.find(
      f => f.type?.value === 'PRIVACY_QUESTIONNAIRE'
    ),
    techStackForm: infraRequest?.forms?.find(
      f => f.type?.value === 'TECH_STACK'
    )
  }
}
