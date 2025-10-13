import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn
} from '@redesignhealth/ui'

import { resolver } from '../constants'
import { useIntroductionRequestMutation } from '../hooks'
import { Form } from '../types'

import { ErrorAlert } from './error-alert'
import { FormField } from './form-field'
import { SuccessConfirmation } from './success-confirmation'

interface IntroductionRequestFormProps {
  advisorId: string
  advisorName?: string
  isOpen: UseDisclosureReturn['isOpen']
  onClose: UseDisclosureReturn['onClose']
}

export const IntroductionRequestForm = ({
  advisorId,
  isOpen,
  onClose,
  advisorName
}: IntroductionRequestFormProps) => {
  const form = useForm<Form>({ resolver, mode: 'all' })
  const { isSuccess, reset, mutate, isError, isPending } =
    useIntroductionRequestMutation()

  const handleSubmit: SubmitHandler<Form> = async formData => {
    mutate({ advisorId, advisorName: advisorName ?? '', ...formData })
  }

  const handleClose = () => {
    reset()
    form.reset()
    onClose()
  }

  if (isSuccess) {
    return (
      <SuccessConfirmation
        isOpen={isOpen}
        onClose={handleClose}
        advisorName={advisorName}
      />
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="5xl">
      <ModalOverlay />
      <ModalContent minH="470px">
        <ModalHeader>Request Introduction</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          as="form"
          onSubmit={form.handleSubmit(handleSubmit)}
          mt="20px"
        >
          <FormProvider {...form}>
            <Flex flexDir="column" gap="24px">
              <FormField field="requesterName" label="Requester Name" />
              <FormField field="requesterEmail" label="Requester Email" />
              <FormField field="additionalEmails" label="Additional Emails" />
              <FormField field="opcoName" label="OpCo/concept name" />
              <FormField
                type="textarea"
                field="opcoDescription"
                label="OpCo/concept description
                (in context of advisor request)"
              />
            </Flex>
          </FormProvider>

          {isError && <ErrorAlert />}

          <ModalFooter as={Flex} gap="16px" px="0">
            <Button colorScheme="gray" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" isLoading={isPending} colorScheme="blue">
              Request Introduction
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
