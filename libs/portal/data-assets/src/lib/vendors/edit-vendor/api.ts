import { axiosApi } from '../../axios-api'
import { type VendorFormProps } from '../types'

export const updateVendorById = async (
  id?: string,
  vendor?: VendorFormProps
) => {
  const { data } = await axiosApi.put<VendorFormProps>(`/vendor/${id}`, vendor)
  return data
}
