import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  type EditUserProps,
  CompanySummary,
  useCreateEditCompanyMember,
  useGetCompanies,
  useGetPersonByEmail
} from '@redesignhealth/portal/data-assets'
import { CustomDrawer } from '@redesignhealth/portal/ui'
import {
  getCurrentUserRole,
  isSuperAdminRole
} from '@redesignhealth/portal/utils'
import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Flex,
  Input,
  Loader,
  Radio,
  RadioGroupRoot
} from '@redesignhealth/ui'
import { Select as MultiSelect } from 'chakra-react-select'
import * as yup from 'yup'

import { USER_TYPE_OPTIONS } from '../constants'

const formSchema = yup.object().shape({
  email: yup.string().email().required('Required'),
  familyName: yup.string().required('Required'),
  givenName: yup.string().required('Required'),
  memberOf: yup.array().of(yup.string()),
  role: yup.string()
})

type MappedOpCoProps = {
  value: string
  label: string
}[]

// TODO: Extract any commonly used functions into helpers if possible
export const EditUser = () => {
  const { email } = useParams()
  const navigate = useNavigate()
  const drawerRef = useRef<{ handleOnClose(): void }>()
  const [options, setOptions] = useState<MappedOpCoProps>()
  const [defaultOpCoValues, setDefaultOpCoValues] = useState<MappedOpCoProps>()

  const { data, isSuccess: isGetOpCosSuccess } = useGetCompanies()

  const {
    data: personData,
    isPending: isGetLoading,
    isSuccess: isGetSuccess
  } = useGetPersonByEmail(email as string)

  const {
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess: isMutateSuccess
  } = useCreateEditCompanyMember()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isValid }
  } = useForm<EditUserProps>({
    mode: 'onBlur',
    resolver: yupResolver(formSchema)
  })

  const currentUserRole = getCurrentUserRole() as string

  useEffect(() => {
    if (data) {
      const coOptions: MappedOpCoProps = data?.content?.map(
        (co: CompanySummary) => ({
          label: co.name,
          value: co.id
        })
      )
      setOptions(coOptions)
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      setError('root.serverError', {
        message: `${
          error?.response?.data.message ||
          error?.response?.data?.errors?.[0].name
        }`
      })
    }
  }, [error, errors, isError, setError])

  useEffect(() => {
    if (personData && personData.memberOf && options) {
      const userOpCos: MappedOpCoProps = personData.memberOf.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })
      const defaultValues: MappedOpCoProps = options.filter(opCo => {
        return userOpCos.some(co => co.value === opCo.value)
      })
      setDefaultOpCoValues(defaultValues)
    }
  }, [options, personData])

  const handleOnSubmit = handleSubmit(async formData => {
    const deletedOpCoIds = defaultOpCoValues
      ?.filter(opCo => !formData.memberOf?.includes(opCo.value as string))
      .map(co => co.value)

    formData['deletedOpCoIds'] = deletedOpCoIds

    await mutateAsync(formData)
  })

  useEffect(() => {
    if (isError) {
      setError('root.serverError', {
        message: `${error?.response?.data.errors?.[0].name} ${error?.response?.data.errors?.[0].description}`
      })
    } else if (isMutateSuccess) {
      drawerRef?.current?.handleOnClose()
    }
  }, [error, isError, isMutateSuccess, setError])

  const handleOnCloseComplete = () => {
    reset()
    navigate(-1)
  }

  // TODO: Extract radio group and multiselect into their own components?
  return (
    <CustomDrawer
      ref={drawerRef}
      title="Edit User"
      description="Update their information below."
      errors={errors}
      loading={isPending}
      isError={isError}
      ctaText="Edit user"
      isValid={isValid}
      handleOnSubmit={handleOnSubmit}
      handleOnCloseComplete={() => handleOnCloseComplete()}
    >
      {(isGetLoading && !isGetSuccess) || !personData ? (
        <Loader />
      ) : (
        <form>
          <Flex direction={['column', 'column', 'row']} gap="6" mb={6}>
            <FieldRoot>
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldLabel htmlFor="role">User Type</FieldLabel>
              <Controller
                name="role"
                control={control}
                defaultValue={personData.role?.authority}
                render={({ field: { onChange, name, ref, value } }) => (
                  <RadioGroupRoot
                    onValueChange={({ value }) => onChange(value)}
                    value={value ?? ''}
                    as={Flex}
                    name={name}
                    ref={ref}
                    flexDir="column"
                    gap="24px"
                    colorPalette="primary"
                    mt="24px"
                    disabled={currentUserRole !== 'ROLE_SUPER_ADMIN'}
                  >
                    {USER_TYPE_OPTIONS.filter(role =>
                      isSuperAdminRole(currentUserRole)
                        ? true
                        : !isSuperAdminRole(role.value)
                    ).map(role => (
                      <Radio
                        key={role.value}
                        value={role.value}
                        readOnly={currentUserRole !== 'ROLE_SUPER_ADMIN'}
                      >
                        {role.label}
                      </Radio>
                    ))}
                  </RadioGroupRoot>
                )}
              />
            </FieldRoot>
          </Flex>
          <Flex flexDir="column" mt="24px" gap="24px">
            <FieldRoot disabled={isPending}>
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input defaultValue={personData.email} {...register('email')} />
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldErrorText role="alert">
                {errors.email?.message}
              </FieldErrorText>
            </FieldRoot>
            <FieldRoot disabled={isPending}>
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldLabel htmlFor="givenName">First Name</FieldLabel>
              <Input
                defaultValue={personData.givenName}
                {...register('givenName')}
              />
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldErrorText role="alert">
                {errors.givenName?.message}
              </FieldErrorText>
            </FieldRoot>
            <FieldRoot disabled={isPending}>
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldLabel htmlFor="familyName">Last name</FieldLabel>
              <Input
                defaultValue={personData.familyName}
                {...register('familyName')}
              />
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldErrorText role="alert">
                {errors.familyName?.message}
              </FieldErrorText>
            </FieldRoot>

            <FieldRoot disabled={isPending}>
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldLabel htmlFor="memberOf">Company assignment</FieldLabel>
              {isGetOpCosSuccess && isGetSuccess && defaultOpCoValues && (
                <Controller
                  name="memberOf"
                  control={control}
                  render={({ field: { ref, name, onChange } }) => (
                    <MultiSelect
                      ref={ref}
                      defaultValue={defaultOpCoValues}
                      isMulti
                      options={options}
                      name={name}
                      onChange={companies => {
                        onChange(companies.map(opCo => opCo.value))
                      }}
                      closeMenuOnSelect={false}
                      blurInputOnSelect={false}
                      colorPalette="primary"
                    />
                  )}
                />
              )}
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldErrorText role="alert">
                {errors.memberOf?.message}
              </FieldErrorText>
              {/* @ts-expect-error Chakra v3 children typing */}
              <FieldHelperText>
                Update the companies this user is assigned to.
              </FieldHelperText>
            </FieldRoot>
          </Flex>
        </form>
      )}
    </CustomDrawer>
  )
}
