import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  type CeoFormFields,
  CEO_FORM_DEFAULT_VALUES,
  useGetCeoById,
  useUpdateCeoFromForm
} from '@redesignhealth/portal/data-assets'
import {
  AxiosErrorAlert,
  CeoForm,
  ceoFormResolver,
  Page
} from '@redesignhealth/portal/ui'
import { Box, Button, Loader, SectionHeader } from '@redesignhealth/ui'

export const EditCeo = () => {
  const { ceoId } = useParams()
  const navigate = useNavigate()

  const { data: ceoData, formFriendlyCeo } = useGetCeoById(ceoId)

  const values = formFriendlyCeo

  const methods = useForm<CeoFormFields>({
    mode: 'onBlur',
    resolver: ceoFormResolver,
    values,
    defaultValues: CEO_FORM_DEFAULT_VALUES
  })

  const {
    handleSubmit,
    setError,
    formState: { isValid }
  } = methods

  const {
    mutateAsync: updateCeo,
    error: updateCeoError,
    isPending,
    isError,
    isSuccess
  } = useUpdateCeoFromForm()

  useEffect(() => {
    if (updateCeoError) {
      setError('root.serverError', {
        message: updateCeoError?.response?.data.message
      })
    } else if (isSuccess) {
      navigate(-1)
    }
  }, [setError, isSuccess, updateCeoError, navigate])

  const handleOnSubmit = handleSubmit(async data => {
    await updateCeo({ id: ceoId, ceo: data })
  })

  return (
    <Page>
      <Helmet>
        <title>CEO Profile Details | Edit</title>
      </Helmet>

      <SectionHeader pb={6} title="Edit profile" />
      <Box
        p="20px"
        borderColor="gray.200"
        borderWidth="1px"
        borderStyle="solid"
        borderRadius="8px"
      >
        {ceoData ? (
          <FormProvider {...methods}>
            {isError && (
              <AxiosErrorAlert error={updateCeoError?.response?.data} mb={3} />
            )}

            <CeoForm apiError={updateCeoError?.response?.data} isEdit={true} />
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
                Update
              </Button>
            </Box>
          </FormProvider>
        ) : (
          <Loader />
        )}
      </Box>
    </Page>
  )
}

export default EditCeo
