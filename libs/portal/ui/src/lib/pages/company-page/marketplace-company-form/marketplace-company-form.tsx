import { Controller, FormProvider, useForm } from 'react-hook-form'
import { CompanyCommand } from '@redesignhealth/portal/data-assets'
import { selectTransformer } from '@redesignhealth/portal/utils'
import { TEXTAREA_CHARACTER_LIMIT } from '@redesignhealth/portal/utils'
import { Input, Radio, RadioGroup, Stack, Textarea } from '@redesignhealth/ui'
import { Select } from 'chakra-react-select'

import Form from '../../../form/form'
import { FormField } from '../../../form-field/form-field'

import { activityTypes, organizationTypes, regions } from './data/options'
import { marketplaceCompanyFormResolver } from './schema'

interface MarketplaceCompanyFormProps {
  defaultValues?: CompanyCommand
  onSubmit(data: CompanyCommand): Promise<void>
  onCancel(): void
  isEdit?: boolean
  submitText?: string
}
const MarketplaceCompanyForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitText,
  isEdit = false
}: MarketplaceCompanyFormProps) => {
  const methods = useForm<CompanyCommand>({
    resolver: marketplaceCompanyFormResolver,
    mode: 'onBlur',
    defaultValues: defaultValues || {
      activityType: '',
      organizationType: null,
      region: null,
      name: '',
      legalName: '',
      href: '',
      description: ''
    }
  })

  return (
    <FormProvider {...methods}>
      <Form
        disabled={!methods.formState.isValid || methods.formState.isSubmitting}
        onSubmit={methods.handleSubmit(data => onSubmit(data))}
        onCancel={onCancel}
        submitText={submitText}
      >
        <Stack spacing={6}>
          <Controller
            name="activityType"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField
                name={name}
                label="Company type"
                disabledHelpText={
                  isEdit ? 'Company type cannot be changed' : undefined
                }
              >
                <RadioGroup
                  onChange={onChange}
                  name={name}
                  defaultValue={value}
                  colorScheme="primary"
                  onBlur={onBlur}
                  isDisabled={isEdit}
                >
                  <Stack spacing={4}>
                    {activityTypes.map(type => (
                      <Radio key={type.value} value={type.value}>
                        {type.displayName}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormField>
            )}
          />
          <Controller
            name="name"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField name={name} label="Company name">
                <Input
                  name={name}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              </FormField>
            )}
          />
          <Controller
            name="legalName"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField name={name} label="Legal name" optional>
                <Input
                  name={name}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              </FormField>
            )}
          />
          <Controller
            name="organizationType"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField name={name} label="Organization type">
                <Select
                  onBlur={onBlur}
                  value={selectTransformer.input(organizationTypes, value)}
                  options={organizationTypes}
                  getOptionLabel={o => o.displayName}
                  getOptionValue={o => o.value}
                  name={name}
                  onChange={newValue =>
                    onChange(selectTransformer.output(newValue))
                  }
                  placeholder="Select one"
                />
              </FormField>
            )}
          />
          <Controller
            name="region"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField name={name} label="Region">
                <Select
                  onBlur={onBlur}
                  value={selectTransformer.input(regions, value)}
                  options={regions}
                  getOptionLabel={o => o.displayName}
                  getOptionValue={o => o.value}
                  name={name}
                  onChange={newValue =>
                    onChange(selectTransformer.output(newValue))
                  }
                  placeholder="Select one"
                />
              </FormField>
            )}
          />
          <Controller
            name="href"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField name={name} label="Company URL" optional>
                <Input
                  name={name}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              </FormField>
            )}
          />
          <Controller
            name="description"
            control={methods.control}
            render={({ field: { name, onChange, value, onBlur } }) => (
              <FormField
                name={name}
                label="Description"
                optional
                helper={`${
                  TEXTAREA_CHARACTER_LIMIT - (value?.length ?? 0)
                } characters left`}
              >
                <Textarea
                  onBlur={onBlur}
                  name={name}
                  onChange={onChange}
                  value={value}
                  placeholder="Enter a description"
                  maxLength={TEXTAREA_CHARACTER_LIMIT}
                />
              </FormField>
            )}
          />
        </Stack>
      </Form>
    </FormProvider>
  )
}

export default MarketplaceCompanyForm
