import { ChangeEvent, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  COMPANY_VENDOR_FORM_DEFAULT_VALUES,
  CompanyVendorProps,
  useGetCategoriesFilters,
  useGetVendorsNames,
  useGetVendorTags
} from '@redesignhealth/portal/data-assets'
import { FORM_ERROR_MESSAGES } from '@redesignhealth/portal/utils'
import {
  Box,
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Flex,
  Loader,
  Radio,
  RadioGroupRoot,
  Spacer,
  Stack,
  Text
} from '@redesignhealth/ui'
import { Combobox } from 'forgekit-chakra-react-select'
import * as yup from 'yup'

import FormFieldMaster from '../../../form-field-master/form-field-master'
import FormMaster from '../../../form-master/form-master'

import { CustomDateInput } from './custom-date-input'
import { engagementStatuses } from './types'

import 'react-datepicker/dist/react-datepicker.css'
import './react-datepicker.css'

type DatePickerCompatible = Date | null | undefined
type DateHookFormCompatible = string | Date | ChangeEvent<Element> | undefined

interface NewCompanyVendorFormProps {
  defaultValues?: CompanyVendorProps
  onSubmit(data: CompanyVendorProps): Promise<void>
  onCancel(): void
  isEdit?: boolean
  submitText?: string
  isPending: boolean
}

const formSchema = yup.object().shape({
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'End date must be greater than start date')
    .nullable(),
  engagementStatus: yup.string().required(FORM_ERROR_MESSAGES.SELECT_ONE),
  name: yup.string().required(FORM_ERROR_MESSAGES.SELECT_ONE),
  startDate: yup.date().nullable(),
  subcategories: yup.array().min(1, FORM_ERROR_MESSAGES.SELECT_AT_LEAST_ONE),
  willingToDiscuss: yup.boolean().required(FORM_ERROR_MESSAGES.REQUIRED)
})

export const CompanyVendorForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit,
  submitText,
  isPending
}: NewCompanyVendorFormProps) => {
  const { data: categoriesData } = useGetCategoriesFilters()
  const { data: vendorsNames } = useGetVendorsNames()

  const methods = useForm<CompanyVendorProps>({
    resolver: yupResolver(formSchema),
    mode: 'onBlur',
    defaultValues: defaultValues || COMPANY_VENDOR_FORM_DEFAULT_VALUES
  })

  const {
    handleSubmit,
    /**
     * Read the formState before render to subscribe the form state through the Proxy
     * https://react-hook-form.com/docs/useform/formstate#return
     *  */
    watch,
    setValue,
    formState: { isSubmitting, errors, isValid },
    control
  } = methods

  const name = useWatch({ control: control, name: 'name' })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const { data: vendorTags } = useGetVendorTags(name)
  //console.log(vendorTags)

  useEffect(() => {
    if (isEdit) {
      return
    }
    if (!vendorTags) {
      return
    }
    if (!categoriesData) {
      return
    }
    //console.log('in useEffect')
    const tagsNames = vendorTags.map(tag => tag.name)
    const tags = categoriesData.subcategoriesForMutation
      .filter(s => tagsNames.indexOf(s.displayName) !== -1)
      .map(s => s.value)
    setValue('subcategories', tags)
    //methods.resetField('subcategories', { defaultValue: tags })
  }, [categoriesData, isEdit, methods, setValue, vendorTags])

  if (!(categoriesData && vendorsNames)) {
    return <Loader />
  }

  const subcategoryOptions = categoriesData.subcategoriesForMutation

  return (
    <FormProvider {...methods}>
      <FormMaster
        disabled={Boolean(errors) || isSubmitting}
        isPending={isPending}
        isValid={isValid}
        onSubmit={handleSubmit(data => onSubmit(data))}
        onCancel={onCancel}
        submitText={submitText}
      >
        <Stack gap={6}>
          <Controller
            name="name"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster name={name} label="Name">
                <Combobox.Single
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  value={
                    vendorsNames.find(option => option.value === value) ?? null
                  }
                  source={{ kind: 'local', items: vendorsNames }}
                  creatable={{
                    createOption: input => ({ label: input, value: input })
                  }}
                  onChange={option => onChange(option?.value ?? '')}
                  disabled={isEdit}
                />
              </FormFieldMaster>
            )}
          />

          <FieldRoot
            invalid={Boolean(errors.subcategories)}
            disabled={isPending}
          >
            <Flex direction={['column', 'column', 'row']}>
              <Box w={['100%', '100%', '25%']} mr={4}>
                {/* @ts-expect-error Chakra v3 children typing */}
                <FieldLabel color="gray.800">Tags</FieldLabel>
              </Box>
              <Spacer />
              <Box w={['100%', '100%', '75%']}>
                <Controller
                  name="subcategories"
                  control={control}
                  render={({
                    field: {
                      name,
                      onChange: controllerOnChange,
                      value,
                      onBlur,
                      ref
                    }
                  }) => {
                    //console.log(`value is ${JSON.stringify(value)}`)
                    return (
                      <Combobox.Multiple
                        ref={ref}
                        onChange={options => {
                          //console.log(
                          //  `multiValue is ${JSON.stringify(options)}`
                          //)
                          controllerOnChange(
                            options.map(option => option.value)
                          )
                        }}
                        source={{ kind: 'local', items: subcategoryOptions }}
                        value={value.flatMap(subcategory => {
                          //console.log(
                          //  `in a value map operation: ${JSON.stringify(
                          //    subcategory
                          //  )}`
                          //)
                          const option = subcategoryOptions.find(
                            option => option.value.apiId === subcategory.apiId
                          )
                          //console.log(`returning ${JSON.stringify(option)}`)
                          return option ? [option] : []
                        })}
                        onBlur={onBlur}
                        getOptionLabel={option => option.displayName}
                        getOptionValue={option => option.value.apiId}
                        name={name}
                        placeholder="Select all that apply..."
                        disabled={isPending}
                      />
                    )
                  }}
                />
                {/* @ts-expect-error Chakra v3 children typing */}
                <FieldErrorText role="alert">
                  <ErrorMessage errors={errors} name="subcategories" />
                </FieldErrorText>
              </Box>
            </Flex>
          </FieldRoot>

          <Controller
            name="engagementStatus"
            control={control}
            render={({ field: { onChange, name, ref, value, onBlur } }) => (
              <FormFieldMaster name={name} label="Engagement status">
                <Combobox.Single
                  ref={ref}
                  value={
                    engagementStatuses.find(option => option.value === value) ??
                    null
                  }
                  source={{ kind: 'local', items: engagementStatuses }}
                  onChange={option => onChange(option?.value ?? '')}
                  getOptionLabel={option => option.displayName}
                  getOptionValue={option => option.value}
                  name={name}
                  placeholder="Select engagement status"
                  colorPalette="primary"
                  onBlur={onBlur}
                />
              </FormFieldMaster>
            )}
          />

          <FieldRoot invalid={Boolean(errors.startDate)} disabled={isPending}>
            <Flex direction={['column', 'column', 'row']}>
              <Box w={['100%', '100%', '25%']} mr={4}>
                {/* @ts-expect-error Chakra v3 children typing */}
                <FieldLabel color="gray.800">Engagement start</FieldLabel>
              </Box>
              <Spacer />
              <Box w={['100%', '100%', '75%']}>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <DatePicker
                      {...fieldProps}
                      onChange={(e: DatePickerCompatible) =>
                        onChange(e as DateHookFormCompatible)
                      }
                      placeholderText="MM/DD/YYYY"
                      selected={value as DatePickerCompatible}
                      customInput={<CustomDateInput />}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="MM/dd/yyyy"
                      startDate={startDate as DatePickerCompatible}
                      endDate={endDate as DatePickerCompatible}
                    />
                  )}
                />
                {/* @ts-expect-error Chakra v3 children typing */}
                <FieldErrorText role="alert">
                  <ErrorMessage errors={errors} name="startDate" />
                </FieldErrorText>
              </Box>
            </Flex>
          </FieldRoot>

          <FieldRoot
            invalid={Boolean(errors.endDate)}
            disabled={isPending}
            mb={2}
          >
            <Flex direction={['column', 'column', 'row']}>
              <Box w={['100%', '100%', '25%']} mr={4}>
                {/* @ts-expect-error Chakra v3 children typing */}
                <FieldLabel color="gray.800">Engagement end</FieldLabel>
              </Box>
              <Spacer />
              <Box w={['100%', '100%', '75%']}>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <DatePicker
                      {...fieldProps}
                      onChange={(e: DatePickerCompatible) =>
                        onChange(e as DateHookFormCompatible)
                      }
                      placeholderText="MM/DD/YYYY"
                      selected={value as DatePickerCompatible}
                      customInput={<CustomDateInput />}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="MM/dd/yyyy"
                      startDate={startDate as DatePickerCompatible}
                      endDate={value as DatePickerCompatible}
                      minDate={startDate as DatePickerCompatible}
                    />
                  )}
                />
                {/* @ts-expect-error Chakra v3 children typing */}
                <FieldErrorText role="alert">
                  <ErrorMessage errors={errors} name="endDate" />
                </FieldErrorText>
              </Box>
            </Flex>
          </FieldRoot>

          <Controller
            name="willingToDiscuss"
            control={control}
            render={({ field }) => (
              <FormFieldMaster
                name={field.name}
                label="Are you willing to discuss your engagement with other founders?"
              >
                <RadioGroupRoot
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={
                    field.value === undefined ? '' : field.value ? 'yes' : 'no'
                  }
                  onValueChange={({ value }) => field.onChange(value === 'yes')}
                  as={Flex}
                  gap="40px"
                >
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroupRoot>
              </FormFieldMaster>
            )}
          />
          <Box>
            <Text fontWeight="medium">Disclaimer</Text>
            <Text fontSize="sm" color="gray.600">
              By clicking accept or agree when this option is made available to
              you, you: (i) represent and warrant that: you have all rights,
              consents, and permissions required to lawfully disclose any and
              all information provided by you to Redesign Health, including
              information related to any third-party Vendor, and to allow
              Redesign Health to feature such information on Redesign Health's
              platform (the “Platform”); and (ii) agree to indemnify, defend,
              and hold harmless Redesign Health from any and all damages or
              other losses arising out of any third-party claim, action, or
              proceeding related to Redesign Health featuring on the Platform
              any third-party Vendor information provided by you.
            </Text>
          </Box>
        </Stack>
      </FormMaster>
    </FormProvider>
  )
}
