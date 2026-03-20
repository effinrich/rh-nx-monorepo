import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  CEO_FORM_DEFAULT_VALUES,
  CeoFormFields,
  convertCeoToFormFields,
  useGetCeoById,
  useGetUserInfo,
  useUpdateCeoFromForm
} from '@redesignhealth/portal/data-assets'
import {
  Button,
  CardRoot,
  CardBody,
  CardFooter,
  Divider,
  Loader
} from '@redesignhealth/ui'

import { CeoForm } from '../../../ceo-directory-page/ceo-form/ceo-form'
import { ceoFormResolver } from '../../../ceo-directory-page/ceo-form/schema'

interface OptInConfirmationProps {
  handleCancel(): void
}

const OptInConfirmation = ({ handleCancel }: OptInConfirmationProps) => {
  const { data: user } = useGetUserInfo()
  const { data: ceo, isPending } = useGetCeoById(user?.ceoInfo.id)
  const { mutateAsync: updateCeo, isPending: updateCeoIsLoading } =
    useUpdateCeoFromForm()
  const navigate = useNavigate()

  // Set default values to avoid React error
  // React complains when input fields are null/undefined
  // https://github.com/react-hook-form/documentation/issues/133
  const methods = useForm<CeoFormFields>({
    defaultValues: CEO_FORM_DEFAULT_VALUES,
    mode: 'onBlur',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: ceoFormResolver as any
  })

  useEffect(() => {
    if (ceo) {
      const defaultValues = convertCeoToFormFields(ceo)
      methods.reset(defaultValues)
      // default to OPT_IN for Opt-in Confirmation
      methods.setValue('visible', 'OPT_IN')
    }
  }, [ceo, methods])

  const handleContinue = methods.handleSubmit(async data => {
    await updateCeo({
      id: ceo?.id,
      ceo: data
    })
    navigate('/ceo-directory/onboarding/success')
  })

  return (
    <CardRoot variant="outline">
      {isPending && <Loader />}
      {ceo && (
        <>
          <CardBody>
            <FormProvider {...methods}>
              <CeoForm isEdit />
            </FormProvider>
          </CardBody>
          <Divider />
          {/* @ts-expect-error Chakra v3 CardFooter children typing */}
          <CardFooter display="flex" justify="end" gap={3}>
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
            <Button
              variant="solid" colorPalette="primary"
              onClick={handleContinue}
              loading={updateCeoIsLoading}
            >
              Continue
            </Button>
          </CardFooter>
        </>
      )}
    </CardRoot>
  )
}

export default OptInConfirmation
