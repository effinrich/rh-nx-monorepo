import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  CompanyCommand,
  useCreateCompany,
  useGetCompanies
} from '@redesignhealth/portal/data-assets'
import { CustomDrawer } from '@redesignhealth/portal/ui'
import { dirtyValuesOnly } from '@redesignhealth/portal/utils'
import * as yup from 'yup'

import { type OptionsProps, CompanyForm } from '../ui/company-form/company-form'

const formSchema = yup.object().shape({
  concept: yup.object().when('stage', {
    is: (value: string) => value === 'NEW_CO',
    then: schema => schema.optional()
  }),
  conflicts: yup.array(),
  dashboardHref: yup.string().url(),
  description: yup.string(),
  fundraiseStatus: yup.string(),
  hasPlatformAgreement: yup.boolean(),
  legalName: yup.string(),
  name: yup.string().required('Required'),
  number: yup.string(),
  stage: yup.string().required('Required'),
  theme: yup.object()
})

const defaultValues: Partial<CompanyCommand> = {
  name: '',
  number: undefined,
  legalName: '',
  stage: '',
  concept: undefined,
  theme: undefined,
  conflicts: [],
  description: '',
  linkedApiId: '',
  fundraiseStatus: 'PRE_LAUNCH_PHASE',
  hasPlatformAgreement: false,
  dashboardHref: undefined
}

export const AddCompany = () => {
  const navigate = useNavigate()
  const drawerRef = useRef<{ handleOnClose(): void }>()
  const [conceptOptions, setConceptOptions] = useState<OptionsProps[]>([])
  const [themeOptions, setThemeOptions] = useState<OptionsProps[]>([])
  const [options, setOptions] = useState<OptionsProps[]>([])

  const {
    data,
    // isPending: isGetLoading,
    isSuccess
  } = useGetCompanies()

  /**
   * TODO: make custom hook to create these object arrays for various dropdowns, re-use across both forms.  It's big and ugly.
   */
  useEffect(() => {
    if (data && data.content) {
      const tempOptions: OptionsProps[] = data.content.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })

      const filterConcepts = data.content.filter(co => co.stage === 'CONCEPT')

      const tempConceptOptions: OptionsProps[] = filterConcepts.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })

      const filterThemes = data.content.filter(co => co.stage === 'THEME')

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
  }, [data])

  const {
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess: isMutateSuccess
  } = useCreateCompany()

  const useFormMethods = useForm<CompanyCommand>({
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
    defaultValues
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { dirtyFields, errors, isValid }
  } = useFormMethods

  const handleOnSubmit = handleSubmit(async formData => {
    const dirtyValues = dirtyValuesOnly(dirtyFields, formData)

    await mutateAsync(dirtyValues)
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

  const handleOnCloseComplete = () => {
    reset()
    navigate(-1)
  }

  return (
    <CustomDrawer
      ref={drawerRef}
      title="Add Company"
      description="Enter company information below."
      errors={errors}
      isLoading={isPending}
      isError={isError}
      ctaText="Add company"
      isValid={isValid}
      handleOnSubmit={handleOnSubmit}
      handleOnCloseComplete={() => handleOnCloseComplete()}
    >
      <FormProvider {...useFormMethods}>
        <CompanyForm
          isPending={isPending}
          isSuccess={isSuccess}
          conceptOptions={conceptOptions}
          options={options}
          themeOptions={themeOptions}
        />
      </FormProvider>
    </CustomDrawer>
  )
}
