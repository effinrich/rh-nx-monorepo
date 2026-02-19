import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'
import {
  Box,
  Flex,
  Input,
  NumberInput,
  NumberInputField
} from '@redesignhealth/ui'
import {
  CompanySummary,
  NewSprintProps,
  PersonSummary,
  TaxonomySummary
} from '@redesignhealth/portal/data-assets'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
  Textarea
} from '@redesignhealth/ui'
import { Select } from 'chakra-react-select'

import { FormField } from '../../../form-field/form-field'
import {
  additionalPatientSegmentOptions,
  methodOptions,
  researchServiceOptions,
  segmentOptions,
  specializedMethodOptions,
  teamRoleOptions
} from '../hardcoded-form-values/research-reports'
import {
  sortOptionsAlphabetically,
  transformOptionsFormat
} from '../utils/input-value-helpers'

interface ResearchSprintFormProps {
  form: UseFormReturn<NewSprintProps>
  handleOnSubmit: VoidFunction
  handleOnCloseComplete: VoidFunction
  isPending?: boolean
  isError?: boolean
  groupOptions?: CompanySummary[]
  authorOptions?: PersonSummary[]
  defaultAuthor: PersonSummary[]
  setGroupName: Dispatch<SetStateAction<string | undefined>>
  taxonomyTags?: TaxonomySummary[]
}

export const ResearchSprintForm = ({
  form,
  groupOptions,
  authorOptions,
  defaultAuthor,
  setGroupName,
  taxonomyTags
}: ResearchSprintFormProps) => {
  const [showTaxonomyTags, setShowTaxonomyTags] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [showAddtlFields, setShowAddtlFields] = useState<boolean>(false)
  const [chosenMethod, setChosenMethod] = useState<string | undefined>()

  useEffect(() => {
    if (methodOptions.includes(chosenMethod as string)) setShowAddtlFields(true)
  }, [chosenMethod])

  const handleGroupChange = (event: CompanySummary) => {
    setGroupName(event.id)
    setShowTaxonomyTags(true)
  }

  const handleMethodChange = (event: string) => {
    setChosenMethod(event)
  }

  return (
    <Flex flexDir="column" gap="24px">
      <FormProvider {...form}>
        <FormField
          name="reportUrl"
          label="Report URL"
          helper="Paste the Google Drive share link for the file."
        >
          <Input {...form.register('reportUrl')} placeholder="https://" />
        </FormField>

        {defaultAuthor && (
          <FormField name="authors" label="Authors">
            <Controller
              name="authors"
              control={form.control}
              render={({
                field: { onChange, name, ref },
                fieldState: { error }
              }) => (
                <Select
                  isMulti
                  ref={ref}
                  name={name}
                  onChange={users => {
                    if (users.length < 1) {
                      form.setError('authors', {
                        type: 'validate',
                        message: 'Required'
                      })
                    } else {
                      form.clearErrors('authors')
                    }
                  }}
                  options={authorOptions}
                  closeMenuOnSelect={false}
                  placeholder="Select all that apply"
                  defaultValue={defaultAuthor}
                  getOptionLabel={(option: PersonSummary) =>
                    `${option.givenName} ${option.familyName}`
                  }
                  getOptionValue={(option: PersonSummary) => `${option.email}`}
                  isInvalid={!!error}
                  isClearable={false}
                />
              )}
            />
          </FormField>
        )}

        <FormField name="teamRole" label="Team role">
          <Controller
            name="teamRole"
            control={form.control}
            render={({ field: { onChange, name, ref } }) => (
              <Select
                ref={ref}
                name={name}
                options={transformOptionsFormat(teamRoleOptions)}
                onChange={role => onChange(role?.value)}
                placeholder="Select one"
                defaultValue={{ value: 'In-house', label: 'In-house' }}
              />
            )}
          />
        </FormField>

        <FormField name="companyId" label="Entity name">
          <Controller
            name="companyId"
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
                isInvalid={!!error}
                onBlur={onBlur}
              />
            )}
          />
        </FormField>

        {showTaxonomyTags && taxonomyTags && (
          <FormField name="taxonomy" label="Taxonomy tags">
            {taxonomyTags?.map((tag: TaxonomySummary, index: number) => (
              <Text key={`${tag.value}-${index}`}>{tag.displayName}</Text>
            ))}
          </FormField>
        )}

        <FormField name="title" label="Sprint name">
          <Input {...form.register('title')} />
        </FormField>

        <FormField
          name="objectives"
          label="Research objectives"
          helper={`${1000 - count} characters left`}
        >
          <Controller
            name="objectives"
            control={form.control}
            render={({ field: { value, name, ref, onBlur, onChange } }) => (
              <Textarea
                onChange={event => {
                  setCount(event.target.value.length)
                  onChange(event)
                }}
                onBlur={onBlur}
                name={name}
                value={value}
                ref={ref}
                maxLength={1000}
              />
            )}
          />
        </FormField>

        <FormField name="services" label="Research services">
          <Controller
            name="services"
            control={form.control}
            render={({
              field: { onChange, name, ref, onBlur },
              fieldState: { error }
            }) => (
              <Select
                isMulti
                ref={ref}
                name={name}
                options={transformOptionsFormat(researchServiceOptions)}
                onChange={services => {
                  onChange(services.map(({ value }) => value))
                }}
                closeMenuOnSelect={false}
                placeholder="Select all that apply"
                onBlur={onBlur}
                isInvalid={!!error}
              />
            )}
          />
        </FormField>

        <FormField name="segments" label="Segments">
          <Controller
            name="segments"
            control={form.control}
            render={({
              field: { onChange, name, ref, onBlur },
              fieldState: { error }
            }) => (
              <Select
                isMulti
                ref={ref}
                name={name}
                options={transformOptionsFormat(segmentOptions)}
                onChange={segments => {
                  onChange(segments.map(({ value }) => value))
                }}
                closeMenuOnSelect={false}
                placeholder="Select all that apply"
                onBlur={onBlur}
                isInvalid={!!error}
              />
            )}
          />
        </FormField>

        <FormField name="methods" label="Method">
          <Controller
            name="methods"
            control={form.control}
            render={({
              field: { onChange, name, ref, onBlur },
              fieldState: { error }
            }) => (
              <Select
                ref={ref}
                name={name}
                onChange={method => {
                  handleMethodChange(method?.value as string)
                  onChange(method?.value as string)
                }}
                placeholder="Select one"
                options={transformOptionsFormat(methodOptions)}
                menuPlacement="top"
                onBlur={onBlur}
                isInvalid={!!error}
              />
            )}
          />
        </FormField>

        {showAddtlFields && (
          <>
            <FormField name="sampleSize" label="n=">
              <NumberInput>
                <NumberInputField {...form.register('sampleSize')} />
              </NumberInput>
            </FormField>

            <Alert status="info">
              <AlertIcon />
              <AlertTitle>Reminder: Ensure Link Integrity</AlertTitle>
              <AlertDescription>
                Remember to share the original VI-owned file stored in the
                Venture Insights Google Drive. Be sure to use a shareable link
                instead of a shortcut.
              </AlertDescription>
            </Alert>

            <FormField
              name="SOW"
              label="SOW"
              helper="Place the Google Drive share link for the file."
            >
              <Input
                {...form.register('supportingFiles.SOW')}
                placeholder="https://"
              />
            </FormField>

            {chosenMethod === 'Survey' ? (
              <FormField
                name="surveyDraft"
                label="Survey draft"
                helper="Place the Google Drive share link for the file."
              >
                <Input
                  {...form.register('supportingFiles.surveyDraft')}
                  placeholder="https://"
                />
              </FormField>
            ) : (
              <>
                <FormField
                  name="discussionGuide"
                  label="Discussion guide"
                  helper="Place the Google Drive share link for the file."
                >
                  <Input
                    {...form.register('supportingFiles.discussionGuide')}
                    placeholder="https://"
                  />
                </FormField>
                <FormField
                  name="screener"
                  label="Screener"
                  helper="Place the Google Drive share link for the file."
                >
                  <Input
                    {...form.register('supportingFiles.screener')}
                    placeholder="https://"
                  />
                </FormField>
              </>
            )}

            <FormField
              name="conceptExposure"
              label="Concept exposure (required for concept tests)"
              helper="Place the Google Drive share link for the file."
            >
              <Input
                {...form.register('supportingFiles.conceptExposure')}
                placeholder="https://"
              />
            </FormField>

            {chosenMethod === 'survey' && (
              <FormField
                name="workbook"
                label="Workbook"
                helper="Place the Google Drive share link for the file."
              >
                <Input
                  {...form.register('supportingFiles.workbook')}
                  placeholder="https://"
                />
              </FormField>
            )}

            <FormField
              name="readoutRecording"
              label="Readout recording (optional)"
              helper="Place the Google Drive share link for the file."
            >
              <Input
                {...form.register('supportingFiles.readoutRecording')}
                placeholder="https://"
              />
            </FormField>

            {chosenMethod !== 'survey' && (
              <>
                <FormField
                  name="discussionNotes"
                  label="Discussion notes (optional)"
                  helper="Place the Google Drive share link for the file."
                >
                  <Input
                    {...form.register('supportingFiles.discussionNotes')}
                    placeholder="https://"
                  />
                </FormField>

                <FormField
                  name="transcriptRecording"
                  label="Transcript recording (optional)"
                  helper="Place the Google Drive share link for the file."
                >
                  <Input
                    {...form.register('supportingFiles.transcriptRecording')}
                    placeholder="https://"
                  />
                </FormField>

                <FormField
                  name="recruitmentGrid"
                  label="Recruitment grid (optional)"
                  helper="Place the Google Drive share link for the file."
                >
                  <Input
                    {...form.register('supportingFiles.recruitmentGrid')}
                    placeholder="https://"
                  />
                </FormField>
              </>
            )}

            <FormField
              name="ventureInsightsSummary"
              label="Summary of Venture Insights (optional)"
              helper="Place the Google Drive share link for the file."
            >
              <Input
                {...form.register('supportingFiles.ventureInsightsSummary')}
                placeholder="https://"
              />
            </FormField>

            <FormField
              name="additionalSegments"
              label="Additional patient segments (optional)"
            >
              <Controller
                name="additionalSegments"
                control={form.control}
                render={({ field: { onChange, name, ref } }) => (
                  <Select
                    isMulti
                    ref={ref}
                    name={name}
                    onChange={segments => {
                      onChange(segments.map(({ value }) => value))
                    }}
                    options={transformOptionsFormat(
                      additionalPatientSegmentOptions
                    )}
                    closeMenuOnSelect={false}
                    placeholder="Select all that apply"
                  />
                )}
              />
            </FormField>

            <FormField
              name="specializedMethods"
              label="Specialized methods (optional)"
            >
              <Controller
                name="specializedMethods"
                control={form.control}
                render={({ field: { onChange, name, ref } }) => (
                  <Select
                    isMulti
                    ref={ref}
                    name={name}
                    onChange={methods => {
                      onChange(methods.map(({ value }) => value))
                    }}
                    options={transformOptionsFormat(specializedMethodOptions)}
                    closeMenuOnSelect={false}
                    menuPlacement="top"
                    placeholder="Select all that apply"
                  />
                )}
              />
            </FormField>
          </>
        )}
      </FormProvider>
    </Flex>
  )
}
