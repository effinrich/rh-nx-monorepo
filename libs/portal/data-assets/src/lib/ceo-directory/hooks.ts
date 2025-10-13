import { sortFilterOptions } from '@redesignhealth/portal/utils'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError, Option } from '../types'

import { createCeo, getCeoById, getCeoFilters, getCeos, updateCeo } from './api'
import {
  Ceo,
  CeoCreateCommand,
  CeoExpansion,
  CeoFormFields,
  CeoSearchValues,
  CeoUpdateCommand
} from './types'

const CEO_QUERY_KEY = 'ceo'

export const useGetCeos = (
  search: CeoSearchValues,
  page: number,
  expand?: CeoExpansion[]
) => {
  return useQuery({
    queryKey: [CEO_QUERY_KEY, { search, page, expand }],
    queryFn: () => getCeos(search, page, expand),
    placeholderData: keepPreviousData
  })
}

export const useGetCeoById = (id?: string) => {
  // Fetch CEO by ID
  const { data, isPending, isSuccess, isFetched } = useQuery({
    queryKey: [CEO_QUERY_KEY, id],
    queryFn: () => getCeoById(id),
    enabled: !!id
  })

  // Transform CEO data into form fields
  const formFriendlyCeo = {
    email: data?.member?.email
      ? {
          label: data?.member?.email || '',
          value: data?.member?.email || ''
        }
      : null,
    location: data?.location
      ? {
          label: data?.location,
          value: data?.location
        }
      : null,
    bio: data?.bio || '',
    pictureHref: data?.pictureHref || '',
    additionalInfo: data?.additionalInfo || '',
    linkedinHref: data?.linkedinHref || '',
    businessType: data?.businessType?.displayName || '',
    customerSegment: data?.customerSegment?.map(segment => segment.value) || [],
    healthcareSector: data?.healthcareSector
      ? {
          label: data?.healthcareSector?.displayName,
          value: data?.healthcareSector?.value
        }
      : null,
    businessFocusArea:
      data?.businessFocusArea?.map(area => ({
        displayName: area.displayName,
        value: area.value
      })) || [],
    marketServiceArea:
      data?.marketServiceArea?.map(area => ({
        label: area,
        value: area
      })) || [],
    visible: data?.visible?.value || ''
  }

  return {
    data,
    formFriendlyCeo,
    isPending,
    isSuccess,
    isFetched
  }
}

export const useGetCeoFilters = () => {
  return useQuery({
    queryKey: [CEO_QUERY_KEY, 'filter-options'],
    queryFn: () => getCeoFilters(),
    select: data =>
      data.reduce<Option[]>((filters, filter) => {
        return {
          ...filters,
          [filter.key]: sortFilterOptions(
            filter.options.map(option => ({
              value: option.keyword,
              label: option.keyword
            }))
          )
        }
      }, [])
  })
}

export const useUpdateCeoFromForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ceo }: { id?: string; ceo: CeoFormFields }) => {
      const command = convertFormFieldsToCommand(ceo)
      return updateCeo(id, command)
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [CEO_QUERY_KEY] })
    },
    onError: (error: AxiosError<ApiError>) => error
  })
}

export const useOptOutCeo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ceo }: { id?: string; ceo: Ceo }) => {
      return updateCeo(id, {
        ...convertCeoToCeoCommand(ceo),
        visible: 'OPT_OUT'
      })
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [CEO_QUERY_KEY] })
    }
  })
}

export const useCreateCeo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ceo: CeoFormFields) => {
      return createCeo(
        convertFormFieldsToCommand({
          ...ceo
        })
      )
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [CEO_QUERY_KEY] })
    },
    onError: (error: AxiosError<ApiError>) => {
      return (error.response?.status || 0) >= 500
    }
  })
}

const convertFormFieldsToCommand = (ceo: CeoFormFields): CeoCreateCommand => {
  const command = {
    ...ceo,
    email: ceo.email?.value ?? '',
    healthcareSector: ceo.healthcareSector?.value,
    businessFocusArea:
      ceo.businessFocusArea?.map(area => area.value as string) || [],
    location: ceo.location?.value,
    marketServiceArea: ceo.marketServiceArea?.map(e => e.value as string) ?? [],
    customerSegment: ceo.customerSegment
  }
  for (const key of Object.keys(command)) {
    if (command[key] === '') {
      delete command[key]
    }
  }
  return command
}

export const convertCeoToCeoCommand = (ceo?: Ceo): CeoUpdateCommand => {
  const command = {
    ...ceo,
    visible: ceo?.visible?.value,
    customerSegment: ceo?.customerSegment?.map(e => e.value) || [],
    businessType: ceo?.businessType?.value,
    healthcareSector: ceo?.healthcareSector?.value,
    businessFocusArea: ceo?.businessFocusArea?.map(e => e.value)
  }
  for (const key of Object.keys(command)) {
    if (command[key] === '') {
      delete command[key]
    }
  }
  return command
}

export const DEFAULT_SELECT_OPTION = { value: '', label: '' }

// Form Fiels must be defined/non-null to play nicely with react
// https://react.dev/reference/react-dom/components/input#im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled
export const convertCeoToFormFields = (ceo: Ceo): CeoFormFields => ({
  bio: ceo.bio || '',
  linkedinHref: ceo.linkedinHref || '',
  additionalInfo: ceo.additionalInfo || '',
  pictureHref: ceo.pictureHref || '',
  location: ceo.location
    ? { value: ceo.location, label: ceo.location }
    : DEFAULT_SELECT_OPTION,
  email: { value: ceo.member.email, label: ceo.member.email },
  businessFocusArea:
    ceo.businessFocusArea?.map(e => ({
      displayName: e.displayName,
      value: e.value
    })) || [],
  businessType: ceo.businessType?.value || '',
  customerSegment: ceo.customerSegment?.map(e => e.value) || [],
  healthcareSector: ceo.healthcareSector
    ? {
        value: ceo.healthcareSector?.value,
        label: ceo.healthcareSector?.displayName
      }
    : DEFAULT_SELECT_OPTION,
  marketServiceArea:
    ceo.marketServiceArea?.map(e => ({
      value: e,
      label: e
    })) || [],
  visible: ceo.visible?.value
})

export const CEO_FORM_DEFAULT_VALUES = {
  email: null,
  location: null,
  bio: '',
  pictureHref: '',
  additionalInfo: '',
  linkedinHref: '',
  businessType: '',
  customerSegment: [],
  healthcareSector: null,
  businessFocusArea: [],
  marketServiceArea: [],
  visible: ''
}
