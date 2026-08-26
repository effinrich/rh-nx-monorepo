import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  Box,
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Flex,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Radio,
  RadioGroupRoot,
  Stack,
  Textarea
} from '@redesignhealth/ui'
import { Combobox } from 'forgekit-chakra-react-select'

export interface OptionsProps {
  value: string | undefined
  label: string | undefined
}

interface CompanyFormProps {
  isEdit?: boolean
  isPending: boolean
  isSuccess: boolean
  options: OptionsProps[]
  conceptOptions: OptionsProps[]
  themeOptions: OptionsProps[]
}

export const CompanyForm = ({
  isEdit = false,
  isPending,
  isSuccess,
  options,
  conceptOptions,
  themeOptions
}: CompanyFormProps) => {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext()

  /**
   * This could probably be an external util or custom Textarea component, but
   * we'll address when or if we need this functionality elsewhere.
   */
  const descriptionField = watch('description')
  const stageField = watch('stage')

  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (descriptionField) {
      setCount(descriptionField?.length ?? 0)
    }
  }, [descriptionField])

  return (
    <form>
      <Controller
        name="linkedApiId"
        control={control}
        render={({ field: { value, name, ref } }) => (
          <Input ref={ref} type="hidden" name={name} value={value} />
        )}
      />
      <Flex direction={['column', 'column', 'row']} gap="6" mb={6}>
        <Box w={['full', '40%', '40%']}>
          <FieldRoot invalid={Boolean(errors.name)} disabled={isPending}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Internal name (required)</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value, name, ref, onBlur } }) => (
                <Input
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  placeholder="e.g. Cosmia, Inc."
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldErrorText role="alert">
              <ErrorMessage errors={errors} name="name" />
            </FieldErrorText>
          </FieldRoot>
        </Box>
        <Box w={['full', '20%', '20%']}>
          <FieldRoot disabled={isPending}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Company #</FieldLabel>
            <Controller
              name="number"
              control={control}
              render={({ field: { onChange, value, name, ref } }) => (
                <Input
                  ref={ref}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="e.g. 31"
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldErrorText role="alert">
              <ErrorMessage errors={errors} name="number" />
            </FieldErrorText>
          </FieldRoot>
        </Box>
        <Box w={['full', '40%', '40%']}>
          <FieldRoot disabled={isPending}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Legal name</FieldLabel>
            <Controller
              name="legalName"
              control={control}
              render={({ field: { onChange, value, name, ref } }) => (
                <Input
                  ref={ref}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="e.g. Cosmia, Inc."
                />
              )}
            />
          </FieldRoot>
        </Box>
      </Flex>
      <Flex gap="6" mb={6}>
        <FieldRoot invalid={Boolean(errors.stage)} disabled={isPending}>
          {/* @ts-expect-error Chakra v3 children typing */}
          <FieldLabel>Stage</FieldLabel>
          <Controller
            name="stage"
            control={control}
            render={({
              field: { onChange, value, name, ref },
              formState: { defaultValues }
            }) => (
              <NativeSelectRoot
                colorPalette="primary"
                disabled={
                  isPending || (isEdit && defaultValues?.[name] === 'OP_CO')
                }
              >
                <NativeSelectField
                  name={name}
                  ref={ref}
                  onChange={onChange}
                  value={value}
                  disabled={
                    isPending || (isEdit && defaultValues?.[name] === 'OP_CO')
                  }
                >
                  <option value="">Select stage</option>
                  {isEdit &&
                  (stageField === 'OP_CO' || stageField === 'NEW_CO') ? (
                    <>
                      <option value="OP_CO">OpCo</option>
                      <option value="NEW_CO">NewCo</option>
                    </>
                  ) : (
                    <>
                      <option value="OP_CO">OpCo</option>
                      <option value="NEW_CO">NewCo</option>
                      <option value="THEME">Theme</option>
                      <option value="CONCEPT">Concept</option>
                    </>
                  )}
                </NativeSelectField>
              </NativeSelectRoot>
            )}
          />

          {/* @ts-expect-error Chakra v3 children typing */}
          <FieldErrorText role="alert">
            <ErrorMessage errors={errors} name="stage" />
          </FieldErrorText>
        </FieldRoot>
      </Flex>
      {(stageField === 'NEW_CO' || stageField === 'OP_CO') && (
        <Flex gap="6" mb={6}>
          <FieldRoot
            invalid={Boolean(errors.concept)}
            disabled={isPending || stageField === 'OP_CO'}
          >
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Concept</FieldLabel>
            <Controller
              name="concept"
              control={control}
              render={({ field: { onBlur, onChange, name, ref, value } }) => (
                <Combobox.Single
                  ref={ref}
                  value={value ?? null}
                  source={{ kind: 'local', items: conceptOptions }}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  placeholder="Select concept"
                  disabled={isPending || stageField === 'OP_CO'}
                  invalid={Boolean(errors.concept)}
                  colorPalette="primary"
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldErrorText role="alert">
              <ErrorMessage errors={errors} name="concept" />
            </FieldErrorText>
          </FieldRoot>
        </Flex>
      )}

      {stageField === 'CONCEPT' && (
        <Flex gap="6" mb={6}>
          <FieldRoot invalid={Boolean(errors.theme)} disabled={isPending}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Theme</FieldLabel>
            <Controller
              name="theme"
              control={control}
              render={({ field: { onBlur, onChange, name, ref, value } }) => (
                <Combobox.Single
                  ref={ref}
                  value={value ?? null}
                  source={{ kind: 'local', items: themeOptions }}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  placeholder="Select theme"
                  disabled={isPending}
                  invalid={Boolean(errors.theme)}
                  colorPalette="primary"
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldErrorText role="alert">
              <ErrorMessage errors={errors} name="theme" />
            </FieldErrorText>
          </FieldRoot>
        </Flex>
      )}

      {(stageField === 'NEW_CO' || stageField === 'OP_CO') && (
        <Flex gap="6" mb={6}>
          <FieldRoot disabled={isPending}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Conflicts</FieldLabel>
            {isSuccess && (
              <Controller
                name="conflicts"
                control={control}
                render={({ field: { onBlur, onChange, name, ref, value } }) => {
                  return (
                    <Combobox.Multiple
                      ref={ref}
                      source={{ kind: 'local', items: options }}
                      value={value ?? []}
                      name={name}
                      placeholder="Select conflicts"
                      onBlur={onBlur}
                      onChange={onChange}
                      disabled={isPending}
                      invalid={Boolean(errors.conflicts)}
                      colorPalette="primary"
                    />
                  )
                }}
              />
            )}
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldErrorText role="alert">
              <ErrorMessage errors={errors} name="conflicts" />
            </FieldErrorText>
          </FieldRoot>
        </Flex>
      )}
      {stageField === 'OP_CO' && (
        <Flex gap="6" mb={6}>
          <FieldRoot disabled={isPending}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel>Company URL</FieldLabel>
            <Controller
              name="href"
              control={control}
              render={({ field: { onChange, value, name, ref } }) => (
                <Input
                  ref={ref}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="https://www.companyurl.com"
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldErrorText role="alert">
              <ErrorMessage errors={errors} name="href" />
            </FieldErrorText>
          </FieldRoot>
        </Flex>
      )}
      <FieldRoot disabled={isPending} mb={6}>
        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldLabel>Description</FieldLabel>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value, name, ref } }) => (
            <Textarea
              ref={ref}
              name={name}
              onChange={onChange}
              value={value}
              maxLength={500}
              h="200px"
              placeholder="Enter a description..."
              resize="none"
            />
          )}
        />

        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldHelperText>{500 - count} characters left</FieldHelperText>
      </FieldRoot>
      {stageField === 'OP_CO' && (
        <FieldRoot
          invalid={Boolean(errors.fundraiseStatus)}
          disabled={isPending}
          mb={6}
          as="fieldset"
        >
          {/* @ts-expect-error Chakra v3 children typing */}
          <FieldLabel as="legend">Fundraising Stage</FieldLabel>
          <Controller
            name="fundraiseStatus"
            control={control}
            render={({ field: { onChange, name, ref, value } }) => (
              <RadioGroupRoot
                onValueChange={({ value }) => onChange(value)}
                name={name}
                ref={ref}
                value={value ?? ''}
                colorPalette="primary"
                maxW="175px"
              >
                <Stack>
                  <Radio value="PRE_LAUNCH_PHASE">Pre launch phase</Radio>
                  <Radio value="PRE_SERIES_A">Pre Series A</Radio>
                  <Radio value="SERIES_A">Series A</Radio>
                  <Radio value="SERIES_B">Series B</Radio>
                  <Radio value="SERIES_C">Series C</Radio>
                </Stack>
              </RadioGroupRoot>
            )}
          />
          {/* @ts-expect-error Chakra v3 children typing */}
          <FieldErrorText role="alert">
            <ErrorMessage errors={errors} name="fundraiseStatus" />
          </FieldErrorText>
        </FieldRoot>
      )}
      {stageField === 'OP_CO' && (
        <FieldRoot
          invalid={Boolean(errors.hasPlatformAgreement)}
          disabled={isPending}
          mb={6}
          as="fieldset"
        >
          {/* @ts-expect-error Chakra v3 children typing */}
          <FieldLabel as="legend">Signed Platform Agreement?</FieldLabel>
          <Controller
            name="hasPlatformAgreement"
            control={control}
            render={({ field: { onChange, name, ref, value } }) => (
              <RadioGroupRoot
                onValueChange={({ value }) => onChange(value === 'true')}
                name={name}
                ref={ref}
                value={value == null ? '' : String(value)}
                colorPalette="primary"
                maxW="175px"
              >
                <Stack>
                  <Radio value="true">Yes</Radio>
                  <Radio value="false">No</Radio>
                </Stack>
              </RadioGroupRoot>
            )}
          />
          {/* @ts-expect-error Chakra v3 children typing */}
          <FieldErrorText role="alert">
            <ErrorMessage errors={errors} name="hasPlatformAgreement" />
          </FieldErrorText>
        </FieldRoot>
      )}
      <FieldRoot
        disabled={isPending}
        mb={6}
        invalid={Boolean(errors.dashboardHref)}
      >
        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldLabel>Dashboard URL</FieldLabel>
        <Controller
          name="dashboardHref"
          control={control}
          render={({ field: { onChange, value, name, ref } }) => (
            <Input
              ref={ref}
              name={name}
              onChange={onChange}
              value={value}
              placeholder="e.g. https://docs.google.com/document/d/1"
            />
          )}
        />
        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldErrorText role="alert">
          <ErrorMessage errors={errors} name="dashboardHref" />
        </FieldErrorText>
        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldHelperText>Link for overview dashboard</FieldHelperText>
      </FieldRoot>
    </form>
  )
}

export default CompanyForm
