import { LoaderFunctionArgs, redirect } from 'react-router-dom'

export const CompanyDetailsLoader = ({ params }: LoaderFunctionArgs) => {
  return redirect(`/companies/${params.companyId}/overview`)
}
