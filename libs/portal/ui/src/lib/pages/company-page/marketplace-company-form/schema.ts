import { yupResolver } from '@hookform/resolvers/yup'
import {
  FORM_ERROR_MESSAGES,
  TEXTAREA_CHARACTER_LIMIT
} from '@redesignhealth/portal/utils'
import * as yup from 'yup'

const { REQUIRED, INVALID_URL } = FORM_ERROR_MESSAGES

const marketplaceCompanyFormSchema = yup.object().shape({
  activityType: yup.string().required(REQUIRED),
  description: yup.string().max(TEXTAREA_CHARACTER_LIMIT),
  href: yup.string().url(INVALID_URL),
  legalName: yup.string(),
  name: yup.string().required(REQUIRED),
  organizationType: yup.string().required(REQUIRED),
  region: yup.string().required(REQUIRED)
})

export const marketplaceCompanyFormResolver = yupResolver(
  marketplaceCompanyFormSchema
)
