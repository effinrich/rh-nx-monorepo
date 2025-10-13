import { Dispatch, DragEvent, SetStateAction, useRef, useState } from 'react'
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'
import {
  MdAttachFile,
  MdCheck,
  MdClose,
  MdOutlineFileUpload
} from 'react-icons/md'
import {
  CompanySummary,
  NewNotesProps,
  TaxonomySummary
} from '@redesignhealth/portal/data-assets'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Spacer,
  Text
} from '@redesignhealth/ui'
import { CreatableSelect, Select } from 'chakra-react-select'

import { FormField } from '../../../form-field/form-field'
import {
  INTERVIEW_SOURCES,
  NOTE_TYPES,
  STAKEHOLDERS
} from '../hardcoded-form-values/call-notes'
import {
  sortOptionsAlphabetically,
  transformOptionsFormat
} from '../utils/input-value-helpers'

interface CallNotesFormProps {
  form: UseFormReturn<NewNotesProps>
  groupOptions?: CompanySummary[]
  setCompany: Dispatch<SetStateAction<string | undefined>>
  taxonomyTags?: TaxonomySummary[]
  handleFileChange: (
    files: FileList | File,
    action: 'append' | 'delete'
  ) => void
  fileArray: File[] | undefined
  disclaimerRequired: boolean
  additionalTagOptions?: string[]
}

export const CallNotesForm = ({
  form,
  groupOptions,
  setCompany,
  taxonomyTags,
  handleFileChange,
  fileArray,
  disclaimerRequired = false,
  additionalTagOptions
}: CallNotesFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showTaxonomyTags, setShowTaxonomyTags] = useState<boolean>(false)
  const [companyName, setCompanyName] = useState<string>()

  const handleGroupChange = (event: CompanySummary) => {
    const company = groupOptions?.filter(co => co.id === event.id)

    setCompany(event.id)
    setCompanyName(company?.[0]['name'])
    setShowTaxonomyTags(true)
  }

  const preventBubbling = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <Flex flexDir="column" gap="24px">
      <FormProvider {...form}>
        <FormField
          testid="noteHref"
          name="noteHref"
          label="Call notes URL"
          helper="Paste the Google Drive share link for the file."
        >
          <Input {...form.register('noteHref')} placeholder="https://" />
        </FormField>

        <FormField
          testid="intervieweeName"
          name="intervieweeName"
          label="Interviewee name"
        >
          <Input {...form.register('intervieweeName')} />
        </FormField>

        <FormField testid="type" name="type" label="Note type">
          <Controller
            name="type"
            control={form.control}
            render={({
              field: { onChange, name, ref, onBlur, value },
              fieldState: { error }
            }) => (
              <Select
                ref={ref}
                name={name}
                onChange={type => {
                  onChange(type?.value as string)
                }}
                placeholder="Select one"
                options={transformOptionsFormat(NOTE_TYPES)}
                onBlur={onBlur}
                isInvalid={!!error}
              />
            )}
          />
        </FormField>

        <FormField
          testid="sourceOfInterview"
          name="sourceOfInterview"
          label="Interview source"
        >
          <Controller
            name="sourceOfInterview"
            control={form.control}
            render={({
              field: { onChange, name, ref, onBlur },
              fieldState: { error }
            }) => (
              <Select
                ref={ref}
                name={name}
                onChange={source => {
                  onChange(source?.value as string)
                }}
                placeholder="Select one"
                options={transformOptionsFormat(INTERVIEW_SOURCES)}
                onBlur={onBlur}
                isInvalid={!!error}
              />
            )}
          />
        </FormField>

        <FormField testid="companyIds" name="companyIds" label="Entity name">
          <Controller
            name="companyIds"
            control={form.control}
            render={({
              field: { onChange, name, ref, onBlur },
              fieldState: { error }
            }) => (
              <Select
                ref={ref}
                name={name}
                onChange={entity => {
                  handleGroupChange(entity as CompanySummary)
                  onChange(entity?.id as string)
                }}
                placeholder="Select one"
                options={sortOptionsAlphabetically(
                  groupOptions as CompanySummary[]
                )}
                getOptionLabel={(option: CompanySummary) => `${option.name}`}
                getOptionValue={(option: CompanySummary) => `${option.id}`}
                onBlur={onBlur}
                isInvalid={!!error}
              />
            )}
          />
        </FormField>

        {showTaxonomyTags && taxonomyTags && (
          <Box>
            <Text fontSize="sm" mb={3}>
              {`Taxonomy tags for ${companyName}`}
            </Text>
            {taxonomyTags?.map((tag: TaxonomySummary, index: number) => (
              <Text key={`${tag.value}-${index}`} fontSize={12}>
                {tag.displayName}
              </Text>
            ))}
          </Box>
        )}

        <FormField
          testid="intervieweeCompany"
          name="intervieweeCompany"
          label="Interviewee company (optional)"
        >
          <Input {...form.register('intervieweeCompany')} />
        </FormField>

        <FormField
          testid="intervieweeEmail"
          name="intervieweeEmail"
          label="Interviewee email (optional)"
        >
          <Input {...form.register('intervieweeEmail')} />
        </FormField>

        <FormField
          testid="linkedInProfileHref"
          name="linkedInProfileHref"
          label="Interviewee LinkedIn URL (optional)"
        >
          <Input
            {...form.register('linkedInProfileHref')}
            placeholder="https://"
          />
        </FormField>

        <FormField
          testid="stakeholders"
          name="stakeholders"
          label="Stakeholders (optional)"
        >
          <Controller
            name="stakeholders"
            control={form.control}
            render={({ field: { onChange, name, ref } }) => (
              <Select
                isMulti
                ref={ref}
                name={name}
                onChange={stakeholders => {
                  onChange(stakeholders?.map(({ value }) => value))
                }}
                options={transformOptionsFormat(STAKEHOLDERS)}
                closeMenuOnSelect={false}
                placeholder="Select all that apply"
              />
            )}
          />
        </FormField>

        <FormField
          testid="additionalTags"
          name="additionalTags"
          label="Additional tags (optional)"
        >
          <Controller
            name="additionalTags"
            control={form.control}
            render={({ field: { onChange, name, ref } }) => (
              <CreatableSelect
                isMulti
                ref={ref}
                name={name}
                onChange={tags => onChange(tags?.map(({ value }) => value))}
                placeholder="Select all that apply"
                options={transformOptionsFormat(
                  additionalTagOptions as string[]
                )}
              />
            )}
          />
        </FormField>

        {/* TODO: Move file upload section to separate component */}
        <FormField
          testid="attachments"
          label="Attachments (optional)"
          name="file"
        >
          <Controller
            name="file"
            control={form.control}
            render={({ field: { onChange, name, ref } }) => (
              <>
                <InputGroup
                  onDragEnter={preventBubbling}
                  onDragOver={preventBubbling}
                  onDrop={e => {
                    preventBubbling(e)
                    handleFileChange(e.dataTransfer.files as FileList, 'append')
                  }}
                  borderColor="gray.200"
                  borderRadius="lg"
                  borderWidth={1}
                  p={5}
                  width="100%"
                  justifyContent="center"
                >
                  <Input
                    ref={e => {
                      ref(e)
                      inputRef.current = e
                    }}
                    multiple
                    type="file"
                    name={name}
                    onChange={e => {
                      onChange(e)
                      handleFileChange(e.target.files as FileList, 'append')
                    }}
                    display="none"
                  />
                  <Flex flexDir="column" justify="center" align="center">
                    <Box
                      backgroundColor="purple.200"
                      borderRadius="50%"
                      p={2}
                      mb={1}
                    >
                      <MdOutlineFileUpload size={20} />
                    </Box>
                    <HStack spacing={1}>
                      <Button
                        variant="link"
                        fontWeight="normal"
                        textDecoration="underline"
                        fontSize={12}
                        textColor="purple.600"
                        onClick={() => inputRef?.current?.click()}
                        _hover={{
                          textDecoration: 'underline'
                        }}
                      >
                        Click to upload
                      </Button>
                      <Text fontSize="xs">or drag and drop</Text>
                    </HStack>
                  </Flex>
                </InputGroup>
                {fileArray &&
                  fileArray?.map((file: File, index: number) => (
                    <Flex
                      borderColor="gray.200"
                      borderRadius="lg"
                      borderWidth={1}
                      key={`${index}`}
                      minWidth="max-content"
                      alignItems="center"
                      gap={2}
                      p={2}
                      mt={2}
                    >
                      <Flex
                        backgroundColor="gray.200"
                        borderRadius="50%"
                        p={2}
                        align="center"
                      >
                        <Icon as={MdAttachFile} boxSize={5} />
                      </Flex>

                      <Box>
                        <Text fontSize={14}>{file.name}</Text>
                        <HStack>
                          <Text fontSize={12} color="green.500">
                            File uploaded
                          </Text>
                          <Icon as={MdCheck} color="green.500" />
                        </HStack>
                      </Box>
                      <Spacer />
                      <IconButton
                        icon={<MdClose />}
                        onClick={() => handleFileChange(file, 'delete')}
                        id={`${file.name}`}
                        aria-label={`${file.name}`}
                      />
                    </Flex>
                  ))}
              </>
            )}
          />
        </FormField>

        {disclaimerRequired && (
          <FormField
            testid="isAttachmentDisclaimerAccepted"
            name="isAttachmentDisclaimerAccepted"
            label="Attachment disclaimer"
          >
            <Text fontWeight="normal" fontSize={14} mt={0}>
              By checking this box, I confirm that I possess all necessary
              rights, licenses, and permissions for any material or content that
              I upload to the Platform. The uploaded material does not infringe
              upon the intellectual property rights, including but not limited
              to copyrights, trademarks, or patents, of any third party.
            </Text>
            <Checkbox
              {...form.register('isAttachmentDisclaimerAccepted')}
              mt={1}
            >
              {' '}
              I confirm
            </Checkbox>
          </FormField>
        )}
      </FormProvider>
    </Flex>
  )
}
