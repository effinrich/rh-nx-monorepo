import { yupResolver } from '@hookform/resolvers/yup'
import { FORM_ERROR_MESSAGES } from '@redesignhealth/portal/utils'
import * as yup from 'yup'

const { REQUIRED, INVALID_URL } = FORM_ERROR_MESSAGES
const ceoFormSchema = yup.object().shape({
  additionalInfo: yup.string(),
  bio: yup.string(),
  businessFocusArea: yup.array().of(yup.object()),
  businessType: yup.string(),
  customerSegment: yup.array().of(yup.string()),
  email: yup.object().required(REQUIRED),
  healthcareSector: yup.object().nullable(),
  linkedinHref: yup.string().url(INVALID_URL),
  location: yup.object().nullable(),
  marketServiceArea: yup.array().of(yup.object()),
  pictureHref: yup.string().url(INVALID_URL)
})

export const ceoFormResolver = yupResolver(ceoFormSchema)
