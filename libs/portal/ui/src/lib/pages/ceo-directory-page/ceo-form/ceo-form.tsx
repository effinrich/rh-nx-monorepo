import { Controller, useFormContext } from 'react-hook-form'
import {
  ApiError,
  Option,
  ReactSelectOption,
  useGetUser
} from '@redesignhealth/portal/data-assets'
import { printPersonName } from '@redesignhealth/portal/utils'
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  HStack,
  Input,
  Radio,
  RadioGroupRoot,
  Stack,
  Textarea
} from '@redesignhealth/ui'
import { Combobox } from 'forgekit-chakra-react-select'

import CeoSummaryCard from './partials/ceo-summary'
import FormDivider from './partials/form-divider'
import FormFieldContainer from './partials/form-field-container'
import HeadshotUploader from './partials/headshot-uploader'
import UserSelect from './partials/user-select'
import {
  businessFocusArea,
  businessType,
  customerSegment,
  healthcareSector,
  locations,
  serviceArea
} from './data'

interface CeoFormProps {
  apiError?: ApiError
  isEdit?: boolean
  user?: {
    name: string | undefined
    companyName: string | undefined
    email: string | undefined
  }
}

export const CeoForm = ({ apiError, isEdit = false, user }: CeoFormProps) => {
  const {
    control,
    watch,
    reset,
    formState: { errors: clientErrors },
    setValue
  } = useFormContext()

  const { data: emailUser } = useGetUser(watch('email')?.value, ['memberOf'])

  const serverFieldErrors = apiError?.errors

  return (
    <form>
      <Stack gap={6}>
        {!isEdit && (
          <Controller
            name="email"
            control={control}
            render={({
              field: { onChange, name, value, onBlur, ref },
              fieldState: { invalid }
            }) => (
              <FormFieldContainer
                name={name}
                label="Select a user"
                serverErrors={serverFieldErrors}
                clientErrors={clientErrors}
              >
                <UserSelect
                  ref={ref}
                  onChange={onChange}
                  name={name}
                  value={value ?? null}
                  onBlur={onBlur}
                  invalid={
                    invalid ||
                    Boolean(
                      serverFieldErrors?.some(error => error.name === name)
                    )
                  }
                />
              </FormFieldContainer>
            )}
          />
        )}
        {emailUser && (
          <CeoSummaryCard
            name={printPersonName(emailUser)}
            email={emailUser.email}
            companyName={emailUser.memberOf?.[0]?.name}
          />
        )}
        <FormDivider
          title={isEdit ? 'Personal details' : 'Optional details'}
          py={4}
        />
        <Controller
          name="pictureHref"
          control={control}
          render={({ field: { onChange, name, value, onBlur, ref } }) => (
            <FormFieldContainer
              name={name}
              label="Upload headshot"
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Input
                ref={ref}
                hidden
                value={value}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
              <HeadshotUploader
                onUploadComplete={newValue => setValue(name, newValue)}
                onClear={() =>
                  // This needs to update the uploader to replace with the generic avatar
                  reset({
                    pictureHref: null
                  })
                }
                href={value}
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="location"
          control={control}
          render={({
            field: { onChange, name, ref, value, onBlur },
            fieldState: { invalid }
          }) => (
            <FormFieldContainer
              label="Nearest metropolitan area"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Combobox.Single<Option>
                ref={ref}
                onChange={onChange}
                name={name}
                value={value ?? null}
                source={{ kind: 'local', items: locations }}
                onBlur={onBlur}
                invalid={
                  invalid ||
                  Boolean(serverFieldErrors?.some(error => error.name === name))
                }
                clearable={false}
                placeholder="Select one"
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="bio"
          control={control}
          render={({ field: { onChange, name, ref, value, onBlur } }) => (
            <FormFieldContainer
              label="Bio"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Textarea
                onChange={onChange}
                name={name}
                ref={ref}
                value={value}
                onBlur={onBlur}
                placeholder="Enter a short bio about the individual"
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="additionalInfo"
          control={control}
          render={({ field: { onChange, name, ref, value, onBlur } }) => (
            <FormFieldContainer
              label="What do you want other Redesigners to know about you?"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Textarea
                onChange={onChange}
                name={name}
                ref={ref}
                value={value}
                onBlur={onBlur}
                placeholder="What else do you think Redesign should know?"
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="linkedinHref"
          control={control}
          render={({ field: { onChange, name, ref, value, onBlur } }) => (
            <FormFieldContainer
              label="LinkedIn profile URL"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Input
                onChange={onChange}
                name={name}
                ref={ref}
                value={value}
                onBlur={onBlur}
                placeholder="https://www.linkedin.com/profile"
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="visible"
          control={control}
          render={({ field: { onChange, name, ref, value, onBlur } }) => (
            <FormFieldContainer
              label="CEO Directory opt-in"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <RadioGroupRoot
                onValueChange={({ value }) => onChange(value)}
                name={name}
                ref={ref}
                value={value ?? ''}
                colorPalette="primary"
                onBlur={onBlur}
              >
                <Stack gap={4}>
                  <Radio value="OPT_IN">
                    Yes, I want to <b>opt-in</b> to having my profile be visible
                    in the directory.
                  </Radio>
                  <Radio value="OPT_OUT">
                    No, I want to <b>opt-out</b> to having my profile be visible
                    in the directory.
                  </Radio>
                </Stack>
              </RadioGroupRoot>
            </FormFieldContainer>
          )}
        />
        <FormDivider title="Company details" py={4} />
        <Controller
          name="businessType"
          control={control}
          render={({ field: { onChange, name, ref, value, onBlur } }) => (
            <FormFieldContainer
              label="Business type"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <RadioGroupRoot
                onValueChange={({ value }) => onChange(value)}
                name={name}
                ref={ref}
                value={value ?? ''}
                colorPalette="primary"
                onBlur={onBlur}
              >
                <HStack gap={10}>
                  {businessType.map(type => (
                    <Radio key={type.value} value={type.value}>
                      {type.label}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroupRoot>
            </FormFieldContainer>
          )}
        />
        <Controller
          name="customerSegment"
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <FormFieldContainer
              label="Customer segment (select all that apply)"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <CheckboxGroup
                onValueChange={({ value }) => onChange(value)}
                value={value ?? []}
              >
                <Stack gap={4}>
                  {customerSegment.map(type => (
                    <CheckboxRoot
                      key={type.value}
                      value={type.value}
                      colorPalette="primary"
                    >
                      <CheckboxHiddenInput />
                      <CheckboxControl>
                        <CheckboxIndicator />
                      </CheckboxControl>
                      <CheckboxLabel>{type.label}</CheckboxLabel>
                    </CheckboxRoot>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormFieldContainer>
          )}
        />
        <Controller
          name="healthcareSector"
          control={control}
          render={({
            field: { onChange, name, ref, value, onBlur },
            fieldState: { invalid }
          }) => (
            <FormFieldContainer
              label="Healthcare sector"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Combobox.Single<Option>
                value={value ?? null}
                ref={ref}
                name={name}
                onChange={onChange}
                source={{ kind: 'local', items: healthcareSector }}
                onBlur={onBlur}
                invalid={
                  invalid ||
                  Boolean(serverFieldErrors?.some(error => error.name === name))
                }
                clearable={false}
                placeholder="Select one"
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="businessFocusArea"
          control={control}
          render={({
            field: { onChange, name, ref, value, onBlur },
            fieldState: { invalid }
          }) => (
            <FormFieldContainer
              label="Business focus area"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Combobox.Multiple<ReactSelectOption>
                value={value ?? []}
                ref={ref}
                name={name}
                onChange={onChange}
                source={{ kind: 'local', items: businessFocusArea }}
                onBlur={onBlur}
                getOptionLabel={option => option.displayName ?? ''}
                getOptionValue={option =>
                  option.value ?? option.displayName ?? ''
                }
                invalid={
                  invalid ||
                  Boolean(serverFieldErrors?.some(error => error.name === name))
                }
                clearable={false}
                closeOnSelect
                placeholder="Select all that apply..."
              />
            </FormFieldContainer>
          )}
        />
        <Controller
          name="marketServiceArea"
          control={control}
          render={({
            field: { onChange, name, ref, value, onBlur },
            fieldState: { invalid }
          }) => (
            <FormFieldContainer
              label="Market/Service area"
              name={name}
              serverErrors={serverFieldErrors}
              clientErrors={clientErrors}
            >
              <Combobox.Multiple<Option>
                value={value ?? []}
                ref={ref}
                name={name}
                onChange={onChange}
                source={{ kind: 'local', items: serviceArea }}
                onBlur={onBlur}
                invalid={
                  invalid ||
                  Boolean(serverFieldErrors?.some(error => error.name === name))
                }
                clearable={false}
                closeOnSelect
                placeholder="Select all that apply..."
              />
            </FormFieldContainer>
          )}
        />
      </Stack>
    </form>
  )
}
