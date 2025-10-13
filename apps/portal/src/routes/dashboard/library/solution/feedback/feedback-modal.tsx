import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  RadioGroup,
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
    const { isOpen, onOpen, onClose } = useDisclosure()
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="400px">
          <ModalCloseButton mt="10px" color="gray.500" />
          <ModalBody color="gray.500">
            <form>
              <FormControl>
                <FormLabel fontSize="18px" mt="24px">
                  How can we improve this article?
                </FormLabel>
                <Controller
                  name="improvements"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onChange={field.onChange}
                      value={field.value}
                      name={field.name}
                      ref={field.ref}
                      as={Flex}
                      flexDir="column"
                      gap="14px"
                      colorScheme="primary"
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
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="18px" mt="24px">
                  Share additional info and suggestions
                </FormLabel>
                <Textarea
                  placeholder="Additional comments"
                  {...register('comments')}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => handleOnCloseComplete()}
              variant="outline"
              mr={2}
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} colorScheme="brand">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)

FeedbackModal.displayName = 'FeedbackModal'
