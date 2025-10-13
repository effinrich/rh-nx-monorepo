import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
  MdOutlineComment,
  MdOutlineThumbDown,
  MdOutlineThumbUp
} from 'react-icons/md'
import { Button, HStack, Icon, IconButton } from '@redesignhealth/ui'

import { FeedbackModal, FeedbackProps } from './feedback-modal'
import { usePutFeedbackMutation } from './hooks'

export const FeedbackFooter = ({ moduleTitle, id }: FeedbackProps) => {
  const modalRef = useRef<{ handleOnOpen(): void }>()
  const { mutateAsync, isError, error } = usePutFeedbackMutation()

  const { handleSubmit, setError } = useForm({
    mode: 'onBlur'
  })

  const handleThumbsUp = handleSubmit(async () => {
    await mutateAsync({
      feedback: {
        title: moduleTitle,
        improvements: 'Thumbs up',
        comments: 'N/A'
      },
      id: id
    })
    // TODO: handle this error, so it renders somewhere
    if (isError) {
      setError('root.serverError', {
        message: `${error?.response?.data?.errors?.[0].name} ${error?.response?.data?.errors?.[0].description}`
      })
    }
  })
  const handleThumbsDown = handleSubmit(async () => {
    await mutateAsync({
      feedback: {
        title: moduleTitle,
        improvements: 'Thumbs down',
        comments: 'N/A'
      },
      id: id
    })
    // TODO: handle this error, so it renders somewhere
    if (isError) {
      setError('root.serverError', {
        message: `${error?.response?.data?.errors?.[0].name} ${error?.response?.data?.errors?.[0].description}`
      })
    }
  })

  return (
    <HStack gap={2}>
      <IconButton
        onClick={handleThumbsUp}
        aria-label="library-feedback-positive"
        icon={<Icon as={MdOutlineThumbUp} boxSize={4} />}
        variant="ghost"
        colorScheme="primary"
      />
      <IconButton
        onClick={handleThumbsDown}
        aria-label="library-feedback-negative"
        icon={<Icon as={MdOutlineThumbDown} boxSize={4} />}
        variant="ghost"
        colorScheme="primary"
      />
      <Button
        colorScheme="primary"
        ml={1}
        leftIcon={
          <Icon boxSize={4} as={MdOutlineComment} color="primary.600" />
        }
        color="gray.600"
        variant="ghost"
        fontWeight="normal"
        textDecoration="underline"
        onClick={() => modalRef?.current?.handleOnOpen()}
      >
        Give feedback about this article
      </Button>

      <FeedbackModal ref={modalRef} moduleTitle={moduleTitle} id={id} />
    </HStack>
  )
}
