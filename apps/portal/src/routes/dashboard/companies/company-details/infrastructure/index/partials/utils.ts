import {
  RequestFormCommandStatusEnum,
  RequestFormSummary
} from '@redesignhealth/company-api-types'

export const getCanInfraRequestBeSubmitted = (
  privacyFormStatus: RequestFormSummary['status']['value'],
  techStackFormStatus: RequestFormSummary['status']['value']
) => {
  return (
    privacyFormStatus === RequestFormCommandStatusEnum['Completed'] &&
    techStackFormStatus === RequestFormCommandStatusEnum['Completed']
  )
}
