import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroupRoot,
  Select,
  Stack,
  Textarea
} from '@redesignhealth/ui'
import { Select as ReactSelect } from 'chakra-react-select'

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
          <FormControl invalid={Boolean(errors.name)} disabled={isPending}>
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Internal name (required)</FormLabel>
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
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
              <ErrorMessage errors={errors} name="name" />
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box w={['full', '20%', '20%']}>
          <FormControl disabled={isPending}>
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Company #</FormLabel>
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
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
              <ErrorMessage errors={errors} name="number" />
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box w={['full', '40%', '40%']}>
          <FormControl disabled={isPending}>
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Legal name</FormLabel>
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
          </FormControl>
        </Box>
      </Flex>
      <Flex gap="6" mb={6}>
        <FormControl invalid={Boolean(errors.stage)} disabled={isPending}>
          {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
          <FormLabel>Stage</FormLabel>
          <Controller
            name="stage"
            control={control}
            render={({
              field: { onChange, value, name, ref },
              formState: { defaultValues }
            }) => (
              <Select
                name={name}
                ref={ref}
                onChange={onChange}
                value={value}
                colorPalette="primary"
                placeholder="Select stage"
                disabled={
                  isPending || (isEdit && defaultValues?.[name] === 'OP_CO')
                }
              >
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
              </Select>
            )}
          />

          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
            <ErrorMessage errors={errors} name="stage" />
          </FormErrorMessage>
        </FormControl>
      </Flex>
      {(stageField === 'NEW_CO' || stageField === 'OP_CO') && (
        <Flex gap="6" mb={6}>
          <FormControl
            invalid={Boolean(errors.concept)}
            disabled={isPending || stageField === 'OP_CO'}
          >
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Concept</FormLabel>
            <Controller
              name="concept"
              control={control}
              render={({ field: { onChange, name, ref, value } }) => (
                <ReactSelect
                  ref={ref}
                  value={value}
                  options={conceptOptions}
                  onChange={option => onChange(option)}
                  name={name}
                  placeholder="Select concept"
                  colorPalette="primary"
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
              <ErrorMessage errors={errors} name="concept" />
            </FormErrorMessage>
          </FormControl>
        </Flex>
      )}

      {stageField === 'CONCEPT' && (
        <Flex gap="6" mb={6}>
          <FormControl invalid={Boolean(errors.theme)} disabled={isPending}>
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Theme</FormLabel>
            <Controller
              name="theme"
              control={control}
              render={({ field: { onChange, name, ref, value } }) => (
                <ReactSelect
                  ref={ref}
                  value={value}
                  options={themeOptions}
                  onChange={option => onChange(option)}
                  name={name}
                  placeholder="Select theme"
                  colorPalette="primary"
                />
              )}
            />
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
              <ErrorMessage errors={errors} name="theme" />
            </FormErrorMessage>
          </FormControl>
        </Flex>
      )}

      {(stageField === 'NEW_CO' || stageField === 'OP_CO') && (
        <Flex gap="6" mb={6}>
          <FormControl disabled={isPending}>
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Conflicts</FormLabel>
            {isSuccess && (
              <Controller
                name="conflicts"
                control={control}
                render={({ field: { onChange, name, ref, value } }) => {
                  return (
                    <ReactSelect
                      ref={ref}
                      isMulti
                      options={options}
                      value={value}
                      name={name}
                      placeholder="Select conflicts"
                      onChange={onChange}
                      colorPalette="primary"
                    />
                  )
                }}
              />
            )}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
              <ErrorMessage errors={errors} name="conflicts" />
            </FormErrorMessage>
          </FormControl>
        </Flex>
      )}
      {stageField === 'OP_CO' && (
        <Flex gap="6" mb={6}>
          <FormControl disabled={isPending}>
            {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
            <FormLabel>Company URL</FormLabel>
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
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
            {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
              <ErrorMessage errors={errors} name="href" />
            </FormErrorMessage>
          </FormControl>
        </Flex>
      )}
      <FormControl disabled={isPending} mb={6}>
        {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
        <FormLabel>Description</FormLabel>
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

        {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
        <FormHelperText>{500 - count} characters left</FormHelperText>
      </FormControl>
      {stageField === 'OP_CO' && (
        <FormControl
          invalid={Boolean(errors.fundraiseStatus)}
          disabled={isPending}
          mb={6}
          as="fieldset"
        >
          {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
          <FormLabel as="legend">Fundraising Stage</FormLabel>
          <Controller
            name="fundraiseStatus"
            control={control}
            render={({ field: { onChange, name, ref, value } }) => (
              <RadioGroupRoot
                onChange={onChange}
                name={name}
                ref={ref}
                value={value}
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
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
            <ErrorMessage errors={errors} name="fundraiseStatus" />
          </FormErrorMessage>
        </FormControl>
      )}
      {stageField === 'OP_CO' && (
        <FormControl
          invalid={Boolean(errors.hasPlatformAgreement)}
          disabled={isPending}
          mb={6}
          as="fieldset"
        >
          {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
          <FormLabel as="legend">Signed Platform Agreement?</FormLabel>
          <Controller
            name="hasPlatformAgreement"
            control={control}
            render={({ field: { onChange, name, ref, value } }) => (
              <RadioGroupRoot
                onChange={onChange}
                name={name}
                ref={ref}
                value={String(value)}
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
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
          {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
            <ErrorMessage errors={errors} name="hasPlatformAgreement" />
          </FormErrorMessage>
        </FormControl>
      )}
      <FormControl
        disabled={isPending}
        mb={6}
        invalid={Boolean(errors.dashboardHref)}
      >
        {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
        <FormLabel>Dashboard URL</FormLabel>
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
        {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FormErrorMessage role="alert">
          <ErrorMessage errors={errors} name="dashboardHref" />
        </FormErrorMessage>
        {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
        <FormHelperText>Link for overview dashboard</FormHelperText>
      </FormControl>
    </form>
  )
}

export default CompanyForm
