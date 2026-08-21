import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  Flex,
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
  open: boolean
  onClose: UseDisclosureReturn['onClose']
}

export const IntroductionRequestForm = ({
  advisorId,
  open,
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
        open={open}
        onClose={handleClose}
        advisorName={advisorName}
      />
    )
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e: { open: boolean }) => !e.open && handleClose()}
      size="cover"
    >
      <DialogBackdrop />
      {/* @ts-expect-error Chakra v3 DialogPositioner children typing */}
      <DialogPositioner>
        {/* @ts-expect-error Chakra v3 DialogContent children typing */}
        <DialogContent minH="470px">
          <DialogHeader>Request Introduction</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody
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

            <DialogFooter as={Flex} gap="16px" px="0">
              <Button colorPalette="gray" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" loading={isPending} colorPalette="blue">
                Request Introduction
              </Button>
            </DialogFooter>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
