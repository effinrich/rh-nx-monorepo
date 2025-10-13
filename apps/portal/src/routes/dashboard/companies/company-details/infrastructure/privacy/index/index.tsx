import { useEffect, useState } from 'react'
import {
  ActionFunctionArgs,
  redirect,
  useFetcher,
  useNavigate,
  useParams
} from 'react-router-dom'
import { useGetInfraRequest } from '@redesignhealth/portal/data-assets'
import {
  DrawerForm,
  DrawerFormAccordion,
  DrawerFormControl,
  DrawerFormDescription,
  DrawerFormHeader,
  DrawerFormRadioGroup,
  DrawerFormTextArea
} from '@redesignhealth/portal/ui'
import { getErrorsFromValidation } from '@redesignhealth/portal/utils'
import {
  Button,
  Checkbox,
  CheckboxGroupProps,
  Divider,
  Flex,
  FormErrorMessage,
  FormLabel,
  Stack
} from '@redesignhealth/ui'
import { QueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { updateInfraRequestForm } from '../../../../../../../api/infra-request/put'
import {
  getForms,
  getIsInfraRequestSubmitted
} from '../../../overview/index/partials/utils'

import {
  ACCORDION_EXPANDED_TITLE,
  ACCORDION_TITLE,
  defaultFormRadioGroupOptions,
  examples,
  q3cCheckboxes,
  q7cCheckboxes,
  TEXTAREA_LABEL,
  TEXTAREA_PLACEHOLDER
} from './partials/constants'

export interface CheckBoxExtendedProps extends CheckboxGroupProps {
  name: string
}

export const CompanyInfraPrivacyAction =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const { _action, ...form } = Object.fromEntries(formData)

    const schema = _action === 'draft' ? draftFormSchema : formSchema
    const validation = schema.safeParse(form)
    if (!validation.success) return { ...getErrorsFromValidation(validation) }

    // update form
    await updateInfraRequestForm(
      params.companyId as string,
      'PRIVACY_QUESTIONNAIRE',
      {
        status: _action === 'complete' ? 'COMPLETED' : 'DRAFT',
        form: validation.data
      }
    )
    // invalidate cache
    await queryClient.removeQueries({
      queryKey: ['infra-request']
    })

    return redirect(`/companies/${params.companyId}/infrastructure`)
  }

export const CompanyInfraPrivacy = () => {
  const navigate = useNavigate()
  const { companyId } = useParams()
  //const navigation = useNavigation()
  const [q3checked, setq3checked] = useState<string[]>([])
  const [q7checked, setq7checked] = useState<string[]>([])
  const { data: infraRequest } = useGetInfraRequest(companyId, ['forms'])
  const {
    Form,
    data: actionData,
    state: formState
  } = useFetcher<ReturnType<typeof CompanyInfraPrivacyAction>>()
  const fieldErrors = actionData?.fieldErrors
  const infraRequestSubmitted = getIsInfraRequestSubmitted(
    infraRequest?.status?.value
  )

  const { privacyForm } = getForms(infraRequest)

  useEffect(() => {
    if (privacyForm?.form) {
      const privacyFormData = privacyForm?.form
      const findMultiSelectAnswers = (question: string) =>
        Object.keys(privacyFormData)?.filter(val => {
          return val.startsWith(question) && val !== `${question}-comment`
        })
      const q3AnswersArray = findMultiSelectAnswers('q3-c')
      const newq3array = q3AnswersArray.map(key => privacyFormData[key])

      const q7AnswersArray = findMultiSelectAnswers('q7-a')
      const newq7array = q7AnswersArray.map(key => privacyFormData[key])

      if (newq3array?.length > 0) setq3checked(newq3array)
      if (newq7array?.length > 0) setq7checked(newq7array)
    }
  }, [privacyForm, privacyForm?.form])

  /*
  navigation.formData?.set(
    'q3c',
    `Processing In Memory Only,
  Stored to existing system, e.g. Kafka/SNS/SQS,Database (Managed or Self Managed) or file system storage (S3)`
  )
  */

  return (
    <DrawerForm
      onCloseComplete={() => navigate(-1)}
      header="Privacy questionnaire"
      description="In the context of the project, think about the possible Customer and Employee Personal Data Items and select an answer to each question. Include in comments which Data Items are required and how and why they are used if applicable."
      loading={formState === 'submitting'}
      fetcherForm={Form}
      footer={
        infraRequestSubmitted ? undefined : (
          <Flex w="fit-content" ml="auto">
            <Button
              type="submit"
              name="_action"
              value="draft"
              variant="outline"
              mr="16px"
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
      <Flex flexDir="column" gap="16px">
        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            isInvalid={Boolean(fieldErrors?.['q1-a'])}
            flexDir="column"
            gap="16px"
          >
            <DrawerFormHeader as={FormLabel} data-testid="s1">
              1. Personal information
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q1-a-desc">
              Will the service be collecting any personal information about your
              employees, your contractors, Redesign Health Employees, customers,
              partners, patients or anyone else who would be part of the system?
              Select one response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q1-a"
              defaultValue={privacyForm?.form?.['q1-a']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
            <FormErrorMessage>{fieldErrors?.['q1-a']}</FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q1-a-comment"
              defaultValue={privacyForm?.form?.['q1-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q1-a"
            title={ACCORDION_TITLE}
            expandedTitle={ACCORDION_EXPANDED_TITLE}
            listItems={examples['q1-a']}
          />
        </Flex>
        <Divider />
        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            isInvalid={Boolean(fieldErrors?.['q2-a'])}
            flexDir="column"
            gap="16px"
          >
            <DrawerFormHeader as={FormLabel} data-testid="s2">
              2. Medical information
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q2-a-desc">
              Will the service be collecting any medical information (Protected
              Health Information) about patients or system users? Select one
              response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q2-a"
              defaultValue={privacyForm?.form?.['q2-a']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
            <FormErrorMessage>{fieldErrors?.['q2-a']}</FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q2-a-comment"
              defaultValue={privacyForm?.form?.['q2-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q2-a"
            title={ACCORDION_TITLE}
            expandedTitle={ACCORDION_EXPANDED_TITLE}
            listItems={examples['q2-a']}
          />
        </Flex>

        <Divider />

        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            isInvalid={Boolean(fieldErrors?.['q3-a'])}
            flexDir="column"
            gap="16px"
          >
            <DrawerFormHeader as={FormLabel} data-testid="s3">
              3. Financial information
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q3-a-desc">
              Will the service be collecting any financial information about
              your company, Redesign Health, your partners, your patients, your
              employees or any other users? Select one response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q3-a"
              defaultValue={privacyForm?.form?.['q3-a']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
            <FormErrorMessage>{fieldErrors?.['q3-a']}</FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q3-a-comment"
              defaultValue={privacyForm?.form?.['q3-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q3-a"
            title={ACCORDION_TITLE}
            expandedTitle={ACCORDION_EXPANDED_TITLE}
            listItems={examples['q3-a']}
          />
        </Flex>
        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            isInvalid={Boolean(fieldErrors?.['q3-b'])}
            flexDir="column"
            gap="16px"
          >
            <DrawerFormDescription as={FormLabel} data-testid="q3-b-desc">
              Will your service be collecting any Credit Card data in any way,
              shape or form? Select one response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q3-b"
              defaultValue={privacyForm?.form?.['q3-b']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q3-b-comment"
              defaultValue={privacyForm?.form?.['q3-b-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormControl flexDir="column" gap="16px">
            <DrawerFormDescription as={FormLabel} data-testid="q3-c-desc">
              How will the financial information be stored? Select all that
              apply.
            </DrawerFormDescription>
            <Flex flexDir="column" gap="16px" pb="16px">
              <Stack spacing={[1, 5]} direction="column">
                {q3cCheckboxes.map((value, index) => (
                  <Checkbox
                    key={index}
                    name={`q3-c${index}`}
                    value={value}
                    isReadOnly={infraRequestSubmitted}
                    isChecked={q3checked.includes(value)}
                    onChange={() => {
                      const wasChecked = q3checked.includes(value)
                      let newq3checked: string[] = []
                      if (!wasChecked) {
                        newq3checked = [...q3checked]
                        newq3checked.push(value)
                      } else {
                        newq3checked = q3checked.filter(v => v !== value)
                      }
                      setq3checked(newq3checked)
                    }}
                    px="16px"
                    py="10px"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderRadius="md"
                    w="fit-content"
                    _focusWithin={{
                      bg: 'primary.50',
                      borderColor: 'primary.600'
                    }}
                  >
                    {value}
                  </Checkbox>
                ))}
              </Stack>
              <FormErrorMessage>
                {fieldErrors?.['q3-c0'] ||
                  fieldErrors?.['q3-c1'] ||
                  fieldErrors?.['q3-c2'] ||
                  fieldErrors?.['q3-c3']}
              </FormErrorMessage>
            </Flex>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q3-c-comment"
              defaultValue={privacyForm?.form?.['q3-c-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder='Add a comment if your response was "Other or not sure"'
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>

          {/* <DrawerFormRadioGroup
              name="q3-c"
              defaultValue={privacyForm?.form?.['q3-c']}
              isReadOnly={infraRequestSubmitted}
              direction="column"
              options={[
                { value: 'Processing In Memory Only' },
                { value: 'Stored to existing system, e.g. Kafka/SNS/SQS' },
                {
                  value:
                    'Database (Managed or Self Managed) or file system storage (S3)'
                }
              ]}
            /> */}
        </Flex>

        <Divider />

        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            isInvalid={Boolean(fieldErrors?.['q4-a'])}
            flexDir="column"
            gap="16px"
          >
            <DrawerFormHeader as={FormLabel} data-testid="s4">
              4. Proprietary information
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q4-a-desc">
              Will the service be collecting any additional Proprietary
              information about your company, Redesign Health, your partners,
              your patients, your employees or any other users? Select one
              response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q4-a"
              defaultValue={privacyForm?.form?.['q4-a']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
            <FormErrorMessage>{fieldErrors?.['q4-a']}</FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q4-a-comment"
              defaultValue={privacyForm?.form?.['q4-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q4-a"
            title={ACCORDION_TITLE}
            expandedTitle={ACCORDION_EXPANDED_TITLE}
            listItems={examples['q4-a']}
          />
        </Flex>

        <Divider />

        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            isInvalid={Boolean(fieldErrors?.['q5-a'])}
            flexDir="column"
            gap="16px"
          >
            <DrawerFormHeader as={FormLabel} data-testid="s5">
              5. Data storage
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q5-a-desc">
              Is the information that is collected stored in your system? Select
              one response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q5-a"
              defaultValue={privacyForm?.form?.['q5-a']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
            <FormErrorMessage>{fieldErrors?.['q5-a']}</FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q5-a-comment"
              defaultValue={privacyForm?.form?.['q5-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormControl mt="50px">
            <DrawerFormDescription as={FormLabel} data-testid="q5-b-desc">
              If the information is stored, where will it be stored? Please
              provide detail, if known.
            </DrawerFormDescription>
            <DrawerFormTextArea
              name="q5-b-comment"
              defaultValue={privacyForm?.form?.['q5-b-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder="Add a comment with details"
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q5-b"
            title={ACCORDION_TITLE}
            expandedTitle={ACCORDION_EXPANDED_TITLE}
            listItems={examples['q5-b-comment']}
          />
        </Flex>

        <Divider />

        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl
            flexDir="column"
            gap="16px"
            isInvalid={Boolean(fieldErrors?.['q6-a'])}
          >
            <DrawerFormHeader as={FormLabel} data-testid="s6">
              6. Sharing data with third parties
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q6-a-desc">
              Will the information collected be transmitted outside of your
              system? Select one response.
            </DrawerFormDescription>
            <DrawerFormRadioGroup
              name="q6-a"
              defaultValue={privacyForm?.form?.['q6-a']}
              isReadOnly={infraRequestSubmitted}
              options={defaultFormRadioGroupOptions}
            />
            <FormErrorMessage>{fieldErrors?.['q6-a']}</FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q6-a-comment"
              defaultValue={privacyForm?.form?.['q6-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder={TEXTAREA_PLACEHOLDER}
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q6-a"
            title={ACCORDION_TITLE}
            expandedTitle={ACCORDION_EXPANDED_TITLE}
            listItems={examples['q6-a']}
          />
          <DrawerFormControl mt="50px">
            <DrawerFormDescription as={FormLabel} data-testid="q6-b-desc">
              If the information is transmitted outside your system, how is it
              done? Please provide detail, if known.
            </DrawerFormDescription>
            <DrawerFormTextArea
              name="q6-b-comment"
              defaultValue={privacyForm?.form?.['q6-b-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder="Add a comment with details"
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
          <DrawerFormAccordion
            data-testid="q6-b"
            title={ACCORDION_TITLE}
            expandedTitle="Hide examples"
            listItems={examples['q6-b']}
          />
        </Flex>

        <Divider />

        <Flex flexDir="column" gap="16px" pb="50px">
          <DrawerFormControl flexDir="column" gap="16px">
            <DrawerFormHeader as={FormLabel} data-testid="s7">
              7. After using data
            </DrawerFormHeader>
            <DrawerFormDescription data-testid="q7-a-desc">
              After data is used, is it destroyed or masked when it is no longer
              needed? Select all that apply.
            </DrawerFormDescription>
            <Stack spacing={[1, 5]} direction="column">
              {q7cCheckboxes.map((value, index) => (
                <Checkbox
                  key={index}
                  name={`q7-a${index}`}
                  value={value}
                  isReadOnly={infraRequestSubmitted}
                  defaultChecked={Object.keys(privacyForm?.form || {}).includes(
                    `q7-a${index}`
                  )}
                  isChecked={q7checked.includes(value)}
                  onChange={() => {
                    const wasChecked = q7checked.includes(value)
                    let newq7checked: string[] = []
                    if (!wasChecked) {
                      newq7checked = [...q7checked]
                      newq7checked.push(value)
                    } else {
                      newq7checked = q7checked.filter(v => v !== value)
                    }
                    setq7checked(newq7checked)
                  }}
                  px="16px"
                  py="10px"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderRadius="md"
                  w="fit-content"
                  _focusWithin={{
                    bg: 'primary.50',
                    borderColor: 'primary.600'
                  }}
                >
                  {value}
                </Checkbox>
              ))}
            </Stack>
            {/* <DrawerFormRadioGroup
              isReadOnly={infraRequestSubmitted}
              name="q7-a"
              defaultValue={privacyForm?.form?.['q7-a']}
              direction="column"
              options={[
                { value: 'Data processed in memory and destroyed' },
                { value: 'Masked/Encrypted data written to Disk/DB/Broker' },
                { value: 'Raw data written to Disk/DB/Broker' },
                { value: 'Other' }
              ]}
            /> */}
            <FormErrorMessage>
              {fieldErrors?.['q7-a0'] ||
                fieldErrors?.['q7-a1'] ||
                fieldErrors?.['q7-a2'] ||
                fieldErrors?.['q7-a3']}
            </FormErrorMessage>
          </DrawerFormControl>
          <DrawerFormControl>
            <DrawerFormTextArea
              name="q7-a-comment"
              defaultValue={privacyForm?.form?.['q7-a-comment']}
              isReadOnly={infraRequestSubmitted}
              placeholder='Add a comment if your response was "Other or not sure"'
              aria-label={TEXTAREA_LABEL}
            />
          </DrawerFormControl>
        </Flex>
      </Flex>
    </DrawerForm>
  )
}

const formSchema = z
  .object({
    'q1-a': z.string({ required_error: 'This field is required' }),
    'q2-a': z.string({ required_error: 'This field is required' }),
    'q3-a': z.string({ required_error: 'This field is required' }),
    'q3-b': z.string({ required_error: 'This field is required' }),
    'q3-c0': z.string().optional(),
    'q3-c1': z.string().optional(),
    'q3-c2': z.string().optional(),
    'q3-c3': z.string().optional(),
    'q4-a': z.string({ required_error: 'This field is required' }),
    'q5-a': z.string({ required_error: 'This field is required' }),
    'q6-a': z.string({ required_error: 'This field is required' }),
    'q7-a0': z.string().optional(),
    'q7-a1': z.string().optional(),
    'q7-a2': z.string().optional(),
    'q7-a3': z.string().optional()
  })
  .passthrough()

const draftFormSchema = z
  .object({
    'q1-a': z.string().optional(),
    'q2-a': z.string().optional(),
    'q3-a': z.string().optional(),
    'q3-b': z.string().optional(),
    'q3-c': z.string().optional(),
    'q4-a': z.string().optional(),
    'q5-a': z.string().optional(),
    'q6-a': z.string().optional(),
    'q7-a': z.string().optional()
  })
  .passthrough()
