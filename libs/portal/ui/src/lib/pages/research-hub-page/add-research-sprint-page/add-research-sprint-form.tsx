import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  NewSprintProps,
  PersonSummary,
  TaxonomySummary,
  useGetCompanies,
  useGetUserInfo,
  useGetUsersByRole,
  usePostResearchSprint
} from '@redesignhealth/portal/data-assets'
import { dirtyValuesOnly } from '@redesignhealth/portal/utils'
import * as yup from 'yup'

import FormMaster from '../../../form-master/form-master'
import { ResearchSprintForm } from '../research-sprints/research-sprint-form'

// SHould this be moved to a separate file if we're no longer putting it in with the types?
export const newSprintSchema = yup.object().shape({
  additionalSegments: yup.array().of(yup.string()).optional(),
  authors: yup.array().of(yup.object()).required('Required'),
  companyId: yup.string().required('Required'),
  methods: yup.string().required('Required'),
  objectives: yup.string().required('Required'),
  reportUrl: yup.string().url().required('Required'),
  sampleSize: yup.number().required('Required'),
  segments: yup.array().of(yup.string()).required('Required'),
  services: yup.array().of(yup.string()).required('Required'),
  specializedMethods: yup.array().of(yup.string()).optional(),
  supportingFiles: yup.object().optional(),
  taxonomy: yup.array(yup.string()),
  teamRole: yup.string().optional(),
  title: yup.string().required('Required')
})

const formatSupportingFiles = (files: { [key: string]: string }) =>
  Object.keys(files).map(file => ({
    name: file,
    href: files[file]
  }))

const AddResearchSprintForm = () => {
  const navigate = useNavigate()
  const { data: currentUserInfo } = useGetUserInfo()
  const { data: companies } = useGetCompanies()
  const { data: userData } = useGetUsersByRole('ROLE_OP_CO_USER', false, 500)
  const [defaultAuthors, setDefaultAuthors] = useState<PersonSummary[]>()
  const [groupName, setGroupName] = useState<string>()
  const [taxonomyTags, setTaxonomyTags] = useState<TaxonomySummary[]>()
  const [authorOptions, setAuthorOptions] = useState<PersonSummary[]>()

  const form = useForm<NewSprintProps>({
    mode: 'onBlur',
    resolver: yupResolver(newSprintSchema)
  })

  useEffect(() => {
    setAuthorOptions(userData)
  }, [userData])

  useEffect(() => {
    if (currentUserInfo && currentUserInfo.email) {
      const pluckedAuthorValue = authorOptions?.filter(
        (user: PersonSummary) => user.email === currentUserInfo.email
      )
      setDefaultAuthors(pluckedAuthorValue)
      form.setValue('authors', pluckedAuthorValue as PersonSummary[], {
        shouldDirty: true
      })
    }
  }, [currentUserInfo, authorOptions, form])

  useEffect(() => {
    const selectedGroup = companies?.content?.filter(co => co.id === groupName)
    setTaxonomyTags(selectedGroup?.[0]?.taxonomy)
  }, [groupName, companies])

  const { mutateAsync, isPending, isError, error, isSuccess } =
    usePostResearchSprint()

  const handleOnSubmit = form.handleSubmit(async formData => {
    const dirtyValues = dirtyValuesOnly(form.formState.dirtyFields, formData)

    const authors = dirtyValues['authors']?.map(
      (author: PersonSummary) => author.email
    )
    dirtyValues['authors'] = authors

    // If no role is chosen, submit the default value
    if (!dirtyValues['teamRole']) dirtyValues['teamRole'] = 'In-house'

    const reportURL = dirtyValues['reportUrl']
    if (dirtyValues['supportingFiles']) {
      dirtyValues['supportingFiles'] = formatSupportingFiles({
        report_url: reportURL,
        ...dirtyValues['supportingFiles']
      })
    } else {
      dirtyValues['supportingFiles'] = formatSupportingFiles({
        report_url: reportURL
      })
    }
    delete dirtyValues['reportUrl']

    dirtyValues['methods'] = [dirtyValues['methods']]
    await mutateAsync(dirtyValues)
    navigate(-1)
  })

  useEffect(() => {
    if (isError) {
      form.setError('root.serverError', {
        message: `${error?.response?.data?.message}`
      })
    }
  }, [error, isError, isSuccess, form])

  const handleOnCloseComplete = () => {
    form.reset()
    navigate(-1)
  }

  return (
    <FormMaster
      onCancel={handleOnCloseComplete}
      onSubmit={handleOnSubmit}
      isPending={isPending}
      isValid={form.formState.isValid}
      submitText="Add research sprint"
    >
      <ResearchSprintForm
        handleOnSubmit={handleOnSubmit}
        handleOnCloseComplete={handleOnCloseComplete}
        groupOptions={companies?.content}
        authorOptions={authorOptions}
        setGroupName={setGroupName}
        taxonomyTags={taxonomyTags}
        isPending={isPending}
        isError={isError}
        form={form}
        defaultAuthor={defaultAuthors as PersonSummary[]} // Author select defaults to current user
      />
    </FormMaster>
  )
}

export default AddResearchSprintForm
