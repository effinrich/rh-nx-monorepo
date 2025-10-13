import { axiosApi } from '../../axios-api'
import { type VendorFormProps } from '../types'

export const createVendor = async (vendor: VendorFormProps) => {
  const { data } = await axiosApi.post<VendorFormProps>(`/vendor`, vendor)
  return data
}
