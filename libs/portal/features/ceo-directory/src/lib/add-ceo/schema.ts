import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const ceoFormSchema = yup.object().shape({
  additionalInfo: yup.string(),
  bio: yup.string(),
  businessFocusArea: yup.array().of(yup.object()),
  businessType: yup.string(),
  customerSegment: yup.array().of(yup.string()),
  email: yup.object().required('Required'),
  healthcareSector: yup.object(),
  linkedinHref: yup.string(),
  location: yup.object(),
  marketServiceArea: yup.array().of(yup.object()),
  pictureHref: yup.string()
})

export const ceoFormResolver = yupResolver(ceoFormSchema)
