import { useRef } from 'react'
import {
  ActionFunctionArgs,
  Link,
  useFetcher,
  useParams
} from 'react-router-dom'
import { useGetInfraRequest } from '@redesignhealth/portal/data-assets'
import {
  Alert,
  Badge,
  Box,
  Button,
  CardRoot,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  Flex,
  Heading,
  Loader,
  Spacer,
  Text,
  useDisclosure
} from '@redesignhealth/ui'
import { QueryClient } from '@tanstack/react-query'

import { createInfraRequest } from '../../../../../../api/infra-request/post'
import {
  getForms,
  getIsInfraRequestSubmitted
} from '../../overview/index/partials/utils'

import { InfraFormCard } from './partials/infra-form-card'
import { getCanInfraRequestBeSubmitted } from './partials/utils'

export const CompanyInfraAction =
  (queryClient: QueryClient) =>
  async ({ params }: ActionFunctionArgs) => {
    // submit infra request
    await createInfraRequest(params.companyId as string)

    // invalidate cache
    await queryClient.removeQueries({
      queryKey: ['infra-request']
    })

    return { success: true }
  }

const BADGE_COLOR_SCHEME: Record<string, string> = {
  Pending: 'fuchsia',
  'In progress': 'warning',
  Done: 'success'
}

export const CompanyInfra = () => {
  const { open, onOpen, onClose } = useDisclosure()
  const cardRef = useRef(null)
  const {
    Form,
    data: actionData,
    state: formState
  } = useFetcher<ReturnType<typeof CompanyInfraAction>>()
  const { companyId } = useParams()
  const { data: infraRequest } = useGetInfraRequest(companyId, ['forms'])

  if (infraRequest === undefined) {
    return <Loader />
  }

  const { privacyForm, techStackForm } = getForms(infraRequest)

  const canInfraRequestBeSubmitted = getCanInfraRequestBeSubmitted(
    privacyForm?.status?.value,
    techStackForm?.status?.value
  )

  const isInfraRequestSubmitted = getIsInfraRequestSubmitted(
    infraRequest?.status?.value
  )

  const infraRequestStatus = infraRequest?.status?.displayName

  const developerLibraryInfraLink: string =
    import.meta.env.VITE_PORTAL_DEVELOPER_LIBRARY_INFRA_LINK || '#'

  return (
    <CardRoot p="24px" ref={cardRef}>
      <Box>
        <Heading
          as="h2"
          fontSize="24px"
          lineHeight="32px"
          fontWeight="medium"
          color="gray.900"
        >
          Set up your company's infrastructure
        </Heading>
        <Text
          as="p"
          fontSize="14px"
          lineHeight="20px"
          fontWeight="normal"
          color="gray.500"
          mt="4px"
        >
          These forms should be filled out only after meeting with the
          infrastructure team to review the components. Please email your
          Relationship Manager for further questions, clarifications, etc. For
          more details{' '}
          <Button
            asChild
            variant="plain"
            textDecoration="underline"
            size="sm"
            fontWeight="normal"
          >
            <Link to={developerLibraryInfraLink}>see here</Link>
          </Button>
          .
        </Text>

        {isInfraRequestSubmitted && (
          <Flex direction="row" justify="space-between" align="center">
            <Alert
              status="success"
              borderRadius="12px"
              bg="primary.25"
              borderWidth="1px"
              borderColor="gray.300"
              mt="20px"
              backgroundColor="gray.25"
              color="gray.900"
            >
              <Box>
                <Text
                  mr="4px"
                  fontSize="16px"
                  lineHeight="24px"
                  fontWeight="medium"
                >
                  Your request was submitted.
                </Text>
              </Box>
              <Spacer />
              <Box>
                <Badge
                  colorPalette={`${
                    BADGE_COLOR_SCHEME[infraRequestStatus as string]
                  }`}
                  size="sm"
                  variant="subtle"
                  borderRadius={16}
                >
                  {infraRequestStatus}
                </Badge>
              </Box>
            </Alert>
          </Flex>
        )}

        <InfraFormCard
          to="privacy"
          heading="Privacy questionnaire"
          description="Identify details you plan to collect from team members and customers."
          form={privacyForm}
          data-id="start-privacy"
        />
        <InfraFormCard
          to="tech-stack"
          heading="Tech stack"
          description="Select services to activate for your company."
          form={techStackForm}
          data-id="start-tech-stack"
        />

        {!isInfraRequestSubmitted && (
          <>
            <Button
              type="button"
              colorPalette="primary"
              disabled={!canInfraRequestBeSubmitted}
              onClick={onOpen}
              display="block"
              mt="16px"
              ml="auto"
            >
              Submit
            </Button>

            <DialogRoot
              finalFocusEl={() => cardRef.current}
              open={open && !actionData?.success}
              onOpenChange={(details: { open: boolean }) => {
                if (!details.open) onClose()
              }}
              placement="center"
            >
              <DialogBackdrop />
              {/* @ts-expect-error Chakra v3 DialogContent width prop */}
              <DialogContent w="400px">
                <DialogHeader>Have you reviewed your selections?</DialogHeader>
                {/* @ts-expect-error Chakra v3 DialogCloseTrigger style props */}
                <DialogCloseTrigger mt="10px" color="gray.500" />
                <DialogBody color="gray.500">
                  Once you submit you cannot make changes. Are you sure you want
                  to submit your selections?
                </DialogBody>

                <DialogFooter>
                  <Flex gap="12px" w="full">
                    <Button onClick={onClose} flex="1" variant="outline">
                      Go back
                    </Button>
                    <Form method="post" style={{ flex: 1 }}>
                      <Button
                        type="submit"
                        colorPalette="primary"
                        w="full"
                        loading={formState === 'submitting'}
                      >
                        Yes, Submit
                      </Button>
                    </Form>
                  </Flex>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </>
        )}
      </Box>
    </CardRoot>
  )
}
