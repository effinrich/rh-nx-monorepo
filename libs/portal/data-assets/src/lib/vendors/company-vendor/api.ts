import { axiosApi } from '../../axios-api'
import { CompanyVendorProps } from '../types'

export const postCompanyVendor = async (
  companyId: string,
  data: CompanyVendorProps
) => {
  return axiosApi.post(`/company/${companyId}/vendor`, data)
}

export const putCompanyVendor = async (
  companyId: string,
  companyVendorId: string,
  data: CompanyVendorProps
) => {
  return axiosApi.put(`/company/${companyId}/vendor/${companyVendorId}`, data)
}
