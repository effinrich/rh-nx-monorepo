import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  type CompanySummary,
  type NewNotesProps,
  type TaxonomySummary,
  useGetCompanies,
  useGetExpertFilterOptions,
  useGetUserInfo,
  usePostNotesWithAttachments
} from '@redesignhealth/portal/data-assets'
import { dirtyValuesOnly } from '@redesignhealth/portal/utils'
import * as yup from 'yup'

import FormMaster from '../../../form-master/form-master'
import { CallNotesForm } from '../call-notes/call-notes-form'

export const newNotesSchema = yup.object().shape({
  additionalTags: yup.array().of(yup.string()).optional(),
  companyIds: yup.string().required('Required'),
  file: yup.mixed().optional(),
  intervieweeCompany: yup.string().optional(),
  intervieweeEmail: yup.string().optional(),
  intervieweeName: yup.string().required('Required'),
  isAttachmentDisclaimerAccepted: yup
    .bool()
    .when('file', ([file], schema) =>
      file !== undefined
        ? schema.oneOf([true], 'Must accept terms')
        : schema.nullable().notRequired()
    ),
  linkedInProfileHref: yup.string().optional(),
  noteHref: yup.string().required('Required'),
  sourceOfInterview: yup.string().required('Required'),
  stakeholders: yup.array().of(yup.string()).optional(),
  type: yup.string().required('Required')
})

const AddCallNoteForm = () => {
  const navigate = useNavigate()
  const { data: companies } = useGetCompanies()
  const { data: expertOptions } = useGetExpertFilterOptions()
  const { data: userInfo } = useGetUserInfo()

  const [company, setCompany] = useState<string>()
  const [additionalTags, setAdditionalTags] = useState<string[]>([])
  const [taxonomyTags, setTaxonomyTags] = useState<TaxonomySummary[]>()
  const [fileArray, setFileArray] = useState<File[]>()
  const [allFiles, setAllFiles] = useState<FormData>(new FormData())
  const [disclaimerRequired, setDisclaimerRequired] = useState<boolean>(false)

  const { mutateAsync, isPending, isError, error, isSuccess } =
    usePostNotesWithAttachments()

  useEffect(() => {
    if (expertOptions && expertOptions.tags)
      setAdditionalTags(expertOptions.tags)
  }, [expertOptions, additionalTags])

  useEffect(() => {
    const selectedCompany = companies?.content?.filter(
      (co: CompanySummary) => co.id === company
    )
    setTaxonomyTags(selectedCompany?.[0]?.taxonomy)
  }, [company, companies])

  const form = useForm<NewNotesProps>({
    mode: 'onBlur',
    resolver: yupResolver(newNotesSchema),
    defaultValues: {
      intervieweeName: '',
      type: '',
      sourceOfInterview: '',
      companyIds: '',
      noteHref: '',
      isAttachmentDisclaimerAccepted: false
    }
  })

  const handleFileChange = (
    files: FileList | File,
    action: 'append' | 'delete'
  ) => {
    let allFilesCopy = allFiles

    if (action === 'append') {
      setDisclaimerRequired(true)

      let fileArrayCopy = fileArray || []

      for (let i = 0; i < files?.length; i++) {
        fileArrayCopy = [...fileArrayCopy, files[i]]
        allFilesCopy.append('file', files[i])
      }

      setFileArray(fileArrayCopy)
      form.setValue('file', allFilesCopy, {
        shouldDirty: true
      })
    } else {
      allFilesCopy = new FormData()
      const uploadName = (files as File).name
      const filteredFileArray = fileArray?.filter(
        file => file.name !== uploadName
      )

      if (!filteredFileArray?.length) {
        setDisclaimerRequired(false)
        form.resetField('file', { keepDirty: false })
      } else {
        filteredFileArray?.forEach(file => allFilesCopy.append('file', file))
        form.setValue('file', allFilesCopy, {
          shouldDirty: true
        })
      }

      setFileArray(filteredFileArray)
    }

    setAllFiles(allFilesCopy)
  }

  const handleOnSubmit = form.handleSubmit(async formData => {
    const dirtyValues = dirtyValuesOnly(form.formState.dirtyFields, formData)

    dirtyValues.companyIds = [dirtyValues.companyIds]
    dirtyValues.noteTaker = userInfo?.email

    await mutateAsync(dirtyValues)
    navigate(-1)
  })

  useEffect(() => {
    if (isError) {
      form.setError('root.serverError', {
        message: `${error?.response?.data?.message}`
      })
    }
  }, [error, form, isError, isSuccess])

  const handleOnCloseComplete = () => {
    form.reset()
    navigate(-1)
  }

  return (
    <FormMaster
      onSubmit={handleOnSubmit}
      onCancel={handleOnCloseComplete}
      isPending={isPending}
      isValid={form.formState.isValid}
      submitText="Add call note"
    >
      <CallNotesForm
        form={form}
        groupOptions={companies?.content}
        setCompany={setCompany}
        taxonomyTags={taxonomyTags}
        handleFileChange={handleFileChange}
        fileArray={fileArray}
        disclaimerRequired={disclaimerRequired}
        additionalTagOptions={additionalTags}
      />
    </FormMaster>
  )
}

export default AddCallNoteForm
