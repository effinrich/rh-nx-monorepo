// import { DevTool } from '@hookform/devtools'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  type CompanyCommand,
  useGetCompanies,
  useUpdateCompany
} from '@redesignhealth/portal/data-assets'
import { CustomDrawer } from '@redesignhealth/portal/ui'
import { Loader } from '@redesignhealth/ui'
import * as yup from 'yup'

import { type OptionsProps, CompanyForm } from '../ui/company-form/company-form'

import { getCompanyByIdFormFriendly } from './api'
import { useGetCompanyById } from './hooks'

const formSchema = yup.object().shape({
  concept: yup.object().when('stage', {
    is: (value: string) => value === 'NEW_CO',
    then: schema => schema.optional()
  }),
  conflicts: yup.array(),
  dashboardHref: yup.string().url('Please enter a valid url'),
  description: yup.string(),
  fundraiseStatus: yup.string(),
  hasPlatformAgreement: yup.boolean(),
  legalName: yup.string(),
  name: yup.string().required('Required'),
  number: yup.string(),
  stage: yup.string().required('Required'),
  theme: yup.object()
})

export const EditCompany = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const drawerRef = useRef<{ handleOnClose(): void }>()

  const [conceptOptions, setConceptOptions] = useState<OptionsProps[]>([])
  const [themeOptions, setThemeOptions] = useState<OptionsProps[]>([])
  const [options, setOptions] = useState<OptionsProps[]>([])

  const { data: companiesData } = useGetCompanies()

  const {
    data,
    isPending: isCompanyLoading,
    isSuccess
  } = useGetCompanyById(companyId)

  /**
   * TODO: make custom hook to create these object arrays for various dropdowns, re-use across both forms.  It's big and ugly.
   */
  useEffect(() => {
    if (companiesData && companiesData.content) {
      const tempOptions: OptionsProps[] = companiesData.content.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })

      const filterConcepts = companiesData.content.filter(
        co => co.stage === 'CONCEPT'
      )

      const tempConceptOptions: OptionsProps[] = filterConcepts.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })

      const filterThemes = companiesData.content.filter(
        co => co.stage === 'THEME'
      )

      const tempThemeOptions: OptionsProps[] = filterThemes.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })

      setOptions(tempOptions)
      setConceptOptions(tempConceptOptions)
      setThemeOptions(tempThemeOptions)
    }
  }, [companiesData])

  const {
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess: isMutateSuccess
  } = useUpdateCompany(companyId)

  const useFormMethods = useForm<CompanyCommand>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: () => getCompanyByIdFormFriendly(companyId)
  })

  const {
    // watch,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useFormMethods

  const handleOnSubmit = handleSubmit(async formData => {
    await mutateAsync(formData)
  })

  useEffect(() => {
    if (isError) {
      setError('root.serverError', {
        message: `${error?.response?.data.message}`
      })
    } else if (isMutateSuccess) {
      drawerRef?.current?.handleOnClose()
    }
  }, [error, isError, isMutateSuccess, setError])

  return (
    <CustomDrawer
      ref={drawerRef}
      title="Edit Company"
      description="Update the company information below"
      errors={errors}
      isLoading={isPending}
      isError={isError}
      ctaText="Save"
      isValid={isValid}
      handleOnSubmit={handleOnSubmit}
      handleOnCloseComplete={() => navigate(-1)}
    >
      {(isCompanyLoading && !isSuccess) || !data ? (
        <Loader />
      ) : (
        <FormProvider {...useFormMethods}>
          <CompanyForm
            isEdit
            isPending={isPending}
            isSuccess={isSuccess}
            conceptOptions={conceptOptions}
            options={options}
            themeOptions={themeOptions}
          />
        </FormProvider>
      )}
    </CustomDrawer>
  )
}
