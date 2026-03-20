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
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
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
  const drawerRef = useRef<{ handleOnClose(): void }>(null)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(formSchema) as any
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

    const submitData = { ...formData, deletedOpCoIds } as EditUserProps

    await mutateAsync(submitData)
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
      isLoading={isPending}
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
            <FormControl>
              {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
              <FormLabel htmlFor="role">User Type</FormLabel>
              <Controller
                name="role"
                control={control}
                render={({ field: { onChange, name, ref } }) => (
                  <RadioGroupRoot
                    onChange={onChange}
                    defaultValue={personData.role?.authority}
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
                        disabled={currentUserRole !== 'ROLE_SUPER_ADMIN'}
                      >
                        {role.label}
                      </Radio>
                    ))}
                  </RadioGroupRoot>
                )}
              />
            </FormControl>
          </Flex>
          <Flex flexDir="column" mt="24px" gap="24px">
            <FormControl disabled={isPending}>
              {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input defaultValue={personData.email} {...register('email')} />
              <FormErrorMessage>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl disabled={isPending}>
              {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
              <FormLabel htmlFor="givenName">First Name</FormLabel>
              <Input
                defaultValue={personData.givenName}
                {...register('givenName')}
              />
              <FormErrorMessage>
                {errors.givenName?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl disabled={isPending}>
              {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
              <FormLabel htmlFor="familyName">Last name</FormLabel>
              <Input
                defaultValue={personData.familyName}
                {...register('familyName')}
              />
              <FormErrorMessage>
                {errors.familyName?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl disabled={isPending}>
              {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
              <FormLabel htmlFor="memberOf">Company assignment</FormLabel>
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
                    />
                  )}
                />
              )}
              <FormErrorMessage>
                {errors.memberOf?.message}
              </FormErrorMessage>
              {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
              <FormHelperText>
                Update the companies this user is assigned to.
              </FormHelperText>
            </FormControl>
          </Flex>
        </form>
      )}
    </CustomDrawer>
  )
}
