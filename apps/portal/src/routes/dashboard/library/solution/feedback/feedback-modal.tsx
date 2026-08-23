import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
  DialogTitle,
  FieldLabel,
  FieldRoot,
  Flex,
  Radio,
  RadioGroupRoot,
  Textarea,
  useDisclosure
} from '@redesignhealth/ui'

import { usePutFeedbackMutation } from './hooks'

const RADIO_OPTIONS = [
  {
    value: 'inaccurate',
    label: 'Inaccurate - information provided is incorrect'
  },
  {
    value: 'hard to understand',
    label: 'Hard to understand - unclear or translation is wrong'
  },
  {
    value: 'missing info',
    label: 'Missing info - relevant but not comprehensive'
  },
  {
    value: 'irrelevant',
    label: `Irrelevant - doesn't match the title and/or my expectations`
  },
  {
    value: 'minor errors',
    label: 'Minor errors - formatting issues, typos, and/or broken links'
  },
  {
    value: 'other',
    label: 'Other'
  }
]

export interface FeedbackProps {
  moduleTitle: string | undefined
  id: string | undefined
}

export const FeedbackModal = forwardRef(
  ({ moduleTitle, id }: FeedbackProps, ref) => {
    const { open, onOpen, onClose } = useDisclosure()
    const { mutateAsync, isError, error } = usePutFeedbackMutation()

    useImperativeHandle(ref, () => ({
      handleOnOpen() {
        onOpen()
      }
    }))

    const { register, handleSubmit, reset, control, setError } = useForm({
      mode: 'onBlur'
    })

    const handleFormSubmit = handleSubmit(async formData => {
      // Pull the label of the object to send full text in email
      const improvementsLabel = RADIO_OPTIONS.filter(
        option => option.value === formData['improvements']
      )[0]['label']

      const args = {
        feedback: {
          ...formData,
          improvements: improvementsLabel,
          title: moduleTitle,
          comments: formData.comments
        },
        id: id
      }
      await mutateAsync(args)
      // TODO: handle this error, so it renders somewhere
      if (isError) {
        setError('root.serverError', {
          message: `${error?.response?.data?.errors?.[0].name} ${error?.response?.data?.errors?.[0].description}`
        })
      } else {
        handleOnCloseComplete()
      }
    })

    const handleOnCloseComplete = () => {
      reset()
      onClose()
    }

    return (
      <DialogRoot
        open={open}
        onOpenChange={(e: { open: boolean }) => {
          if (!e.open) handleOnCloseComplete()
        }}
        placement="center"
      >
        <DialogBackdrop />
        {/* @ts-expect-error Chakra v3 children typing */}
        <DialogPositioner>
          {/* @ts-expect-error Chakra v3 children typing */}
          <DialogContent w="400px">
            <DialogCloseTrigger />
            <DialogHeader>
              {/* @ts-expect-error Chakra v3 DialogTitle children typing */}
              <DialogTitle>Share feedback</DialogTitle>
            </DialogHeader>
            <DialogBody color="gray.500">
              <form>
                <FieldRoot>
                  {/* @ts-expect-error Chakra v3 children typing */}
                  <FieldLabel fontSize="18px" mt="24px">
                    How can we improve this article?
                  </FieldLabel>
                  <Controller
                    name="improvements"
                    control={control}
                    render={({ field }) => (
                      <RadioGroupRoot
                        onChange={field.onChange}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                        as={Flex}
                        flexDir="column"
                        gap="14px"
                        colorPalette="primary"
                        mt="14px"
                      >
                        {RADIO_OPTIONS.map((option, index) => (
                          <Radio
                            key={`${option.value}-${index}`}
                            value={option.value}
                            fontSize={12}
                          >
                            {option.label}
                          </Radio>
                        ))}
                      </RadioGroupRoot>
                    )}
                  />
                </FieldRoot>
                <FieldRoot>
                  {/* @ts-expect-error Chakra v3 children typing */}
                  <FieldLabel fontSize="18px" mt="24px">
                    Share additional info and suggestions
                  </FieldLabel>
                  <Textarea
                    placeholder="Additional comments"
                    {...register('comments')}
                  />
                </FieldRoot>
              </form>
            </DialogBody>

            <DialogFooter>
              <Button
                onClick={() => handleOnCloseComplete()}
                variant="outline"
                mr={2}
              >
                Cancel
              </Button>
              <Button onClick={handleFormSubmit} colorPalette="brand">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    )
  }
)

FeedbackModal.displayName = 'FeedbackModal'
