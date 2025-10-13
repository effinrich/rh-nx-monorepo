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
  Card,
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
    resolver: ceoFormResolver
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
    <Card variant="outline">
      {isPending && <Loader />}
      {ceo && (
        <>
          <CardBody>
            <FormProvider {...methods}>
              <CeoForm isEdit />
            </FormProvider>
          </CardBody>
          <Divider />
          <CardFooter display="flex" justify="end" gap={3}>
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleContinue}
              isLoading={updateCeoIsLoading}
            >
              Continue
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default OptInConfirmation
