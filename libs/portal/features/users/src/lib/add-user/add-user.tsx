import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGetCompanies } from '@redesignhealth/portal/data-assets'
import { CustomDrawer } from '@redesignhealth/portal/ui'
import {
  dirtyValuesOnly,
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
  Radio,
  RadioGroup
} from '@redesignhealth/ui'
import { Select as MultiSelect } from 'chakra-react-select'
import * as yup from 'yup'

import { USER_TYPE_OPTIONS } from '../constants'

import { type NewUserProps } from './api'
import { usePostUserProxyMutation } from './hooks'

export type RoleType = string | undefined

const formSchema = yup.object().shape({
  email: yup.string().email().required('Required'),
  familyName: yup.string().required('Required'),
  givenName: yup.string().required('Required'),
  memberOf: yup.array().of(yup.string()),
  role: yup.string().required('Required')
})

// TODO: Extract any commonly used functions into helpers if possible
export const AddUser = () => {
  const navigate = useNavigate()
  const drawerRef = useRef<{ handleOnClose(): void }>()
  const [options, setOptions] = useState<
    {
      value: string
      label: string
    }[]
  >()
  const { data, isSuccess: isGetSuccess } = useGetCompanies()

  const {
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess: isMutateSuccess
  } = usePostUserProxyMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setError,
    formState: { errors, dirtyFields, isValid }
  } = useForm<NewUserProps>({
    mode: 'onBlur',
    resolver: yupResolver(formSchema)
  })
  const userType = watch('role')

  const currentUserRole = getCurrentUserRole() as string

  useEffect(() => {
    if (data) {
      const coOptions: {
        value: string
        label: string
      }[] = data.content.map(co => {
        return {
          label: co.name,
          value: co.id
        }
      })
      setOptions(coOptions)
    }
  }, [data])

  const handleOnSubmit = handleSubmit(async formData => {
    const dirtyValues = dirtyValuesOnly(dirtyFields, formData)

    await mutateAsync(dirtyValues)
  })

  useEffect(() => {
    if (isError) {
      setError('root.serverError', {
        message: `${error?.response?.data?.errors?.[0].name} ${error?.response?.data?.errors?.[0].description}`
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
      title="Add User"
      description="Enter their information below."
      errors={errors}
      isLoading={isPending}
      isError={isError}
      ctaText="Add user"
      isValid={isValid}
      handleOnSubmit={handleOnSubmit}
      handleOnCloseComplete={() => handleOnCloseComplete()}
    >
      <form>
        <Flex direction={['column', 'column', 'row']} gap="6" mb={6}>
          <FormControl isInvalid={Boolean(errors.role)} isDisabled={isPending}>
            <FormLabel htmlFor="role">User Type</FormLabel>
            <Controller
              name="role"
              control={control}
              render={({ field: { onChange, name, ref } }) => (
                <RadioGroup
                  onChange={onChange}
                  as={Flex}
                  name={name}
                  ref={ref}
                  flexDir="column"
                  gap="24px"
                  colorScheme="primary"
                  mt="24px"
                >
                  {USER_TYPE_OPTIONS.filter(role =>
                    isSuperAdminRole(currentUserRole)
                      ? true
                      : !isSuperAdminRole(role.value)
                  ).map(role => (
                    <Radio key={role.value} value={role.value}>
                      {role.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            />
            <FormErrorMessage role="alert">
              {errors.role?.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>
        {userType !== undefined && (
          <Flex flexDir="column" mt="24px" gap="24px">
            <FormControl isDisabled={isPending}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                placeholder="jane.doe@example.com"
                {...register('email')}
              />
              <FormErrorMessage role="alert">
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isDisabled={isPending}>
              <FormLabel htmlFor="givenName">First Name</FormLabel>
              <Input placeholder="Jane" {...register('givenName')} />
              <FormErrorMessage role="alert">
                {errors.givenName?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isDisabled={isPending}>
              <FormLabel htmlFor="familyName">Last name</FormLabel>
              <Input placeholder="Doe" {...register('familyName')} />
              <FormErrorMessage role="alert">
                {errors.familyName?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isDisabled={isPending}>
              <FormLabel htmlFor="memberOf">Company assignment</FormLabel>
              {isGetSuccess && (
                <Controller
                  name="memberOf"
                  control={control}
                  render={({ field: { onChange, name, ref } }) => (
                    <MultiSelect
                      ref={ref}
                      isMulti
                      options={options}
                      name={name}
                      onChange={companies => {
                        onChange(companies.map(opCo => opCo.value))
                      }}
                      closeMenuOnSelect={false}
                      blurInputOnSelect={false}
                      colorScheme="primary"
                    />
                  )}
                />
              )}
              <FormErrorMessage role="alert">
                {errors.memberOf?.message}
              </FormErrorMessage>
              <FormHelperText>
                Select the companies this user is assigned to.
              </FormHelperText>
            </FormControl>
          </Flex>
        )}
      </form>
    </CustomDrawer>
  )
}
