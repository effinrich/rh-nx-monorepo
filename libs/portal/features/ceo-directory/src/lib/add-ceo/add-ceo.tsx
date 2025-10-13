import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  CEO_FORM_DEFAULT_VALUES,
  CeoFormFields,
  useCreateCeo
} from '@redesignhealth/portal/data-assets'
import {
  AxiosErrorAlert,
  CeoForm,
  ceoFormResolver,
  Page
} from '@redesignhealth/portal/ui'
import { Box, Button, SectionHeader } from '@redesignhealth/ui'

export const AddCeo = () => {
  const navigate = useNavigate()

  const methods = useForm<CeoFormFields>({
    mode: 'onBlur',
    resolver: ceoFormResolver,
    defaultValues: CEO_FORM_DEFAULT_VALUES
  })

  const {
    handleSubmit,
    setError,
    formState: { isValid }
  } = methods

  const {
    mutateAsync: createCeo,
    error,
    isPending,
    isError,
    isSuccess
  } = useCreateCeo()

  useEffect(() => {
    if (error) {
      setError('root.serverError', {
        message: error?.response?.data.message
      })
    } else if (isSuccess) {
      navigate(-1)
    }
  }, [setError, isSuccess, error, navigate])

  const handleOnSubmit = handleSubmit(async data => {
    await createCeo(data)
  })

  return (
    <Page>
      <Helmet>
        <title>CEO Profile Details | Add</title>
      </Helmet>

      <SectionHeader pb={6} title="Add profile" />
      <Box
        p="20px"
        borderColor="gray.200"
        borderWidth="1px"
        borderStyle="solid"
        borderRadius="8px"
      >
        <FormProvider {...methods}>
          {isError && <AxiosErrorAlert error={error?.response?.data} mb={3} />}

          <CeoForm apiError={error?.response?.data} />
          <Box as="footer" mt={[10, 8]} display="flex">
            <Button
              variant="outline"
              mr={3}
              onClick={() => navigate(-1)}
              isDisabled={isPending}
              w={['50%', 'auto']}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              isDisabled={isPending || !isValid}
              isLoading={isPending}
              type="submit"
              onClick={() => handleOnSubmit()}
              w={['50%', 'auto']}
            >
              Add CEO
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Page>
  )
}

export default AddCeo
