import { ChangeEvent, forwardRef, LegacyRef, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { MdEditCalendar } from 'react-icons/md'
import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  COMPANY_VENDOR_FORM_DEFAULT_VALUES,
  CompanyVendorProps,
  useGetCategoriesFilters,
  useGetVendorsNames,
  useGetVendorTags
} from '@redesignhealth/portal/data-assets'
import {
  FORM_ERROR_MESSAGES,
  selectTransformer
} from '@redesignhealth/portal/utils'
import {
  type InputProps,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  Loader,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text
} from '@redesignhealth/ui'
import { CreatableSelect, Select } from 'chakra-react-select'
import * as yup from 'yup'

import FormFieldMaster from '../../../form-field-master/form-field-master'
import FormMaster from '../../../form-master/form-master'

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

const customDateInput = (
  { value, onClick, onChange }: InputProps,
  ref: LegacyRef<HTMLInputElement>
) => (
  <InputGroup endElement={<Icon as={MdEditCalendar} boxSize={4} color="gray.600" onClick={onClick} cursor="pointer" />}>
    <Input
      autoComplete="off"
      value={value}
      ref={ref}
      onClick={onClick}
      onChange={onChange}
      width="100%"
      maxW="100%"
      placeholder="MM/DD/YYYY"
    />
  </InputGroup>
)
customDateInput.displayName = 'DateInput'
const CustomInput = forwardRef(customDateInput)

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
                <CreatableSelect
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  value={selectTransformer.input(vendorsNames, value)}
                  getNewOptionData={name => ({ label: name, value: name })}
                  options={vendorsNames}
                  onChange={newValue => {
                    onChange(selectTransformer.output(newValue))
                  }}
                  isDisabled={isEdit}
                />
              </FormFieldMaster>
            )}
          />

          <FormControl
            isInvalid={Boolean(errors.subcategories)}
            isDisabled={isPending}
          >
            <Flex direction={['column', 'column', 'row']}>
              <Box w={['100%', '100%', '25%']} mr={4}>
                <FormLabel color="gray.800">Tags</FormLabel>
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
                      <Select
                        ref={ref}
                        onChange={multiValue => {
                          //console.log(
                          //  `multiValue is ${JSON.stringify(multiValue)}`
                          //)
                          controllerOnChange(
                            multiValue.map(selected => selected.value)
                          )
                        }}
                        options={categoriesData?.subcategoriesForMutation}
                        isMulti
                        onBlur={onBlur}
                        getOptionLabel={option => option.displayName}
                        placeholder="Select all that apply..."
                        value={value.map(subcategory => {
                          //console.log(
                          //  `in a value map operation: ${JSON.stringify(
                          //    subcategory
                          //  )}`
                          //)
                          const option = {
                            displayName: subcategory.name,
                            value: subcategory
                          }
                          //console.log(`returning ${JSON.stringify(option)}`)
                          return option
                        })}
                      />
                    )
                  }}
                />
                <FormErrorMessage role="alert">
                  <ErrorMessage errors={errors} name="subcategories" />
                </FormErrorMessage>
              </Box>
            </Flex>
          </FormControl>

          <Controller
            name="engagementStatus"
            control={control}
            render={({ field: { onChange, name, ref, value, onBlur } }) => (
              <FormFieldMaster name={name} label="Engagement status">
                <Select
                  ref={ref}
                  value={selectTransformer.input(engagementStatuses, value)}
                  options={engagementStatuses}
                  onChange={newValue =>
                    onChange(selectTransformer.output(newValue))
                  }
                  getOptionLabel={o => o.displayName}
                  getOptionValue={o => o.value}
                  name={name}
                  placeholder="Select engagement status"
                  colorScheme="primary"
                  onBlur={onBlur}
                />
              </FormFieldMaster>
            )}
          />

          <FormControl
            isInvalid={Boolean(errors.startDate)}
            isDisabled={isPending}
          >
            <Flex direction={['column', 'column', 'row']}>
              <Box w={['100%', '100%', '25%']} mr={4}>
                <FormLabel color="gray.800">Engagement start</FormLabel>
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
                      customInput={<CustomInput />}
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
                <FormErrorMessage role="alert">
                  <ErrorMessage errors={errors} name="startDate" />
                </FormErrorMessage>
              </Box>
            </Flex>
          </FormControl>

          <FormControl
            isInvalid={Boolean(errors.endDate)}
            isDisabled={isPending}
            mb={2}
          >
            <Flex direction={['column', 'column', 'row']}>
              <Box w={['100%', '100%', '25%']} mr={4}>
                <FormLabel color="gray.800">Engagement end</FormLabel>
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
                      customInput={<CustomInput />}
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
                <FormErrorMessage role="alert">
                  <ErrorMessage errors={errors} name="endDate" />
                </FormErrorMessage>
              </Box>
            </Flex>
          </FormControl>

          <Controller
            name="willingToDiscuss"
            control={control}
            render={({ field }) => (
              <FormFieldMaster
                name={field.name}
                label="Are you willing to discuss your engagement with other founders?"
              >
                <RadioGroup
                  {...field}
                  value={
                    field.value === undefined ? '' : field.value ? 'yes' : 'no'
                  }
                  onChange={value => field.onChange(value === 'yes')}
                  as={Flex}
                  gap="40px"
                >
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroup>
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
