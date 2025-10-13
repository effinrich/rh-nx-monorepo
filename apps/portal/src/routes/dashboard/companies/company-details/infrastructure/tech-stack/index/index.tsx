import { Fragment } from 'react'
import {
  ActionFunctionArgs,
  redirect,
  useFetcher,
  useNavigate,
  useParams
} from 'react-router-dom'
import { InfraRequestCommandStatusEnum } from '@redesignhealth/company-api-types'
import { useGetInfraRequest } from '@redesignhealth/portal/data-assets'
import { DrawerForm } from '@redesignhealth/portal/ui'
import { getErrorsFromValidation } from '@redesignhealth/portal/utils'
import { Box, Button, Divider, Flex, Text } from '@redesignhealth/ui'
import { QueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { updateInfraRequestForm } from '../../../../../../../api/infra-request/put'

import { formItems } from './partials/constants'
import { FormItem } from './partials/form-item'
import { getInputName } from './partials/utils'

export const CompanyInfraTechStackAction =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const { _action, ...form } = Object.fromEntries(formData)

    // validate form data
    const schema = _action === 'draft' ? draftFormSchema : formSchema
    const validation = schema.safeParse(form)
    if (!validation.success) return { ...getErrorsFromValidation(validation) }

    // update form
    await updateInfraRequestForm(params.companyId as string, 'TECH_STACK', {
      status: _action === 'complete' ? 'COMPLETED' : 'DRAFT',
      form: validation.data
    })

    // invalidate cache
    await queryClient.removeQueries({
      queryKey: ['infra-request']
    })

    return redirect(`/companies/${params.companyId}/infrastructure`)
  }

export const CompanyInfraTechStack = () => {
  const navigate = useNavigate()
  const { companyId } = useParams()
  const { data: infraRequest } = useGetInfraRequest(companyId, ['forms'])
  const {
    Form,
    data: actionData,
    state: formState
  } = useFetcher<ReturnType<typeof CompanyInfraTechStackAction>>()

  const fieldErrors = actionData?.fieldErrors

  const infraRequestSubmitted =
    infraRequest?.status?.value === InfraRequestCommandStatusEnum['Pending'] ||
    infraRequest?.status?.value === InfraRequestCommandStatusEnum.Done

  const techStackForm = infraRequest?.forms?.find(
    f => f.type?.value === 'TECH_STACK'
  )

  return (
    <DrawerForm
      onCloseComplete={() => navigate(-1)}
      header="Tech stack"
      description="Select services to activate for your company."
      loading={formState === 'submitting'}
      fetcherForm={Form}
      footer={
        infraRequestSubmitted ? undefined : (
          <Flex w="fit-content" ml="auto">
            <Button
              type="submit"
              name="_action"
              value="draft"
              mr="16px"
              variant="outline"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              name="_action"
              value="complete"
              colorScheme="primary"
            >
              Done
            </Button>
          </Flex>
        )
      }
    >
      <Flex flexDir="column" justify="space-between">
        {Object.entries(formItems).map(
          ([groupName, { groupItems, groupLabel }], index) => (
            <Fragment key={index}>
              <Box _notFirst={{ mt: '16px' }}>
                <Text
                  as="h4"
                  fontSize="18px"
                  lineHeight="28px"
                  fontWeight="medium"
                >
                  {index + 1}. {groupLabel}
                </Text>
                {groupItems.map(
                  ({ categoryName, serviceName, learnMoreItems }, index) => {
                    const radioInputName = getInputName(
                      categoryName,
                      serviceName
                    )
                    const commentInputName = getInputName(
                      categoryName,
                      serviceName,
                      true
                    )
                    return (
                      <FormItem
                        categoryName={categoryName}
                        serviceName={serviceName}
                        learnMoreItems={learnMoreItems}
                        radioDefaultValue={
                          techStackForm?.form?.[radioInputName]
                        }
                        commentDefaultValue={
                          techStackForm?.form?.[commentInputName]
                        }
                        error={fieldErrors?.[radioInputName]?.[0]}
                        isReadOnly={infraRequestSubmitted}
                        key={index}
                      />
                    )
                  }
                )}
              </Box>
              <Divider mt="56px" _last={{ display: 'none' }} />
            </Fragment>
          )
        )}
      </Flex>
    </DrawerForm>
  )
}

const formSchema = z
  .object(
    Object.fromEntries(
      Object.entries(formItems).flatMap(([, groupValue]) =>
        groupValue.groupItems.map(service => [
          getInputName(service.categoryName, service.serviceName),
          z.string({ required_error: 'This field is required' })
        ])
      )
    )
  )
  .passthrough()

const draftFormSchema = z
  .object(
    Object.fromEntries(
      Object.entries(formItems).flatMap(([, groupValue]) =>
        groupValue.groupItems.map(service => [
          getInputName(service.categoryName, service.serviceName),
          z.string().optional()
        ])
      )
    )
  )
  .passthrough()
