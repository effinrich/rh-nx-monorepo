import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  type ApiError,
  useGetCategoriesFilters,
  VENDOR_FORM_DEFAULT_VALUES,
  VendorFormProps
} from '@redesignhealth/portal/data-assets'
import {
  FORM_ERROR_MESSAGES,
  selectTransformer,
  TEXTAREA_CHARACTER_LIMIT
} from '@redesignhealth/portal/utils'
import {
  Input,
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
  Textarea
} from '@redesignhealth/ui'
import { AxiosError } from 'axios'
import { Select } from 'chakra-react-select'
import * as yup from 'yup'

import AxiosErrorAlert from '../../../axios-error-alert/axios-error-alert'
import FormFieldMaster from '../../../form-field-master/form-field-master'
import FormMaster from '../../../form-master/form-master'

import { vendorTypes } from './data/options'

interface NewVendorFormProps {
  defaultValues?: VendorFormProps
  onSubmit(data: VendorFormProps): Promise<void>
  onCancel(): void
  isEdit?: boolean
  submitText?: string
  isPending: boolean
  error?: AxiosError<ApiError, unknown> | null
}

const { REQUIRED } = FORM_ERROR_MESSAGES

const formSchema = yup.object().shape({
  cons: yup.string(),
  description: yup.string().max(TEXTAREA_CHARACTER_LIMIT).required(REQUIRED),
  features: yup.string(),
  feedbackFromOpCos: yup.string(),
  hasPlatformAgreement: yup.boolean(),
  name: yup.string().required(REQUIRED),
  pros: yup.string(),
  subcategories: yup.array().required('Must choose at least one option'),
  vendorPointContact: yup.string(),
  vendorType: yup.string().required(REQUIRED)
})

export const VendorForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitText,
  isEdit = false,
  isPending,
  error
}: NewVendorFormProps) => {
  const { data } = useGetCategoriesFilters()

  const methods = useForm<VendorFormProps>({
    resolver: yupResolver(formSchema),
    mode: 'onBlur',
    defaultValues: defaultValues || VENDOR_FORM_DEFAULT_VALUES
  })

  const {
    handleSubmit,

    /**
     * Read the formState before render to subscribe the form state through the Proxy
     * https://react-hook-form.com/docs/useform/formstate#return
     *  */
    formState: { isSubmitting, errors, isValid },
    control
  } = methods

  return (
    <FormProvider {...methods}>
      {error && <AxiosErrorAlert error={error?.response?.data} mb={5} />}
      <FormMaster
        disabled={Boolean(errors) || isSubmitting}
        isPending={isPending}
        isValid={isValid}
        onSubmit={handleSubmit(data => onSubmit(data))}
        onCancel={onCancel}
        submitText={submitText}
        isSticky
      >
        <Stack spacing={8} divider={<StackDivider borderColor="gray.200" />}>
          <Controller
            name="name"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster name={name} label="Name">
                <Input
                  ref={ref}
                  placeholder="Vendor name"
                  name={name}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              </FormFieldMaster>
            )}
          />

          <Controller
            name="vendorType"
            control={control}
            render={({ field: { onChange, name, ref, value } }) => (
              <FormFieldMaster name={name} label="Type">
                <Select
                  ref={ref}
                  value={selectTransformer.input(vendorTypes, value)}
                  options={vendorTypes}
                  onChange={newValue =>
                    onChange(selectTransformer.output(newValue))
                  }
                  getOptionLabel={o => o.displayName}
                  getOptionValue={o => o.value}
                  name={name}
                  placeholder="Select type"
                  colorScheme="primary"
                />
              </FormFieldMaster>
            )}
          />
          {/* <Controller
            name="vendorType"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster name={name} label="Type">
                <RadioGroup
                  ref={ref}
                  onChange={onChange}
                  name={name}
                  defaultValue={value}
                  colorScheme="primary"
                  onBlur={onBlur}
                >
                  <Stack spacing={4}>
                    {vendorTypes.map(type => (
                      <Radio key={type.value} value={type.value}>
                        {type.displayName}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormFieldMaster>
            )}
          /> */}
          <Controller
            name="subcategories"
            control={control}
            render={({
              field: { name, onChange: controllerOnChange, value, onBlur, ref }
            }) => (
              <FormFieldMaster name={name} label="Tags">
                <Select
                  ref={ref}
                  onChange={multiValue =>
                    controllerOnChange(
                      multiValue.map(selected => selected.value)
                    )
                  }
                  options={data?.subcategoriesForMutation}
                  isMulti
                  onBlur={onBlur}
                  getOptionLabel={option => option.displayName}
                  defaultValue={
                    value
                      ? value.map(subcategory => ({
                          displayName: subcategory.name,
                          value: subcategory
                        }))
                      : []
                  }
                  placeholder="Select all that apply"
                />
              </FormFieldMaster>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Description"
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Describe the vendor"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
          <Controller
            name="hasPlatformAgreement"
            control={control}
            render={({
              field: { name, onChange: controllerOnChange, value, onBlur, ref }
            }) => (
              <FormFieldMaster
                name={name}
                label="Vendor signed platform agreement?"
                optional
              >
                <RadioGroup
                  ref={ref}
                  onChange={nextValue =>
                    controllerOnChange(nextValue === 'true')
                  }
                  name={name}
                  defaultValue={value ? 'true' : 'false'}
                  colorScheme="primary"
                  onBlur={onBlur}
                >
                  <Stack spacing={4}>
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Stack>
                </RadioGroup>
              </FormFieldMaster>
            )}
          />

          <Controller
            name="vendorPointContact"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Contact info"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Vendor point of contact"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
          <Controller
            name="pricing"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Pricing"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Describe the pricing model"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
          <Controller
            name="discountInfo"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Discount info"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Information about discounts"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
          <Controller
            name="feedbackFromOpCos"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Feedback from companies"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Feedback on the vendor"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
          <Controller
            name="pros"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Pros"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Pros about the vendor"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />

          <Controller
            name="cons"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Cons"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Cons about the vendor"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
          <Controller
            name="features"
            control={control}
            render={({ field: { name, onChange, value, onBlur, ref } }) => (
              <FormFieldMaster
                name={name}
                label="Features"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Describe the features offered"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormFieldMaster>
            )}
          />
        </Stack>
      </FormMaster>
    </FormProvider>
  )
}

export default VendorForm
