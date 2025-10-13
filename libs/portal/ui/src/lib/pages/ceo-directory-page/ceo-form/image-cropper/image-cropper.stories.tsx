import { Button, useDisclosure } from '@redesignhealth/ui'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta, StoryObj } from '@storybook/react'

import ImageCropper, { ImageCropperProps } from './image-cropper'

const Story: Meta<typeof ImageCropper> = {
  component: ImageCropper,
  title: 'Components / ImageCropper',
  decorators: [withRouter],
  args: {}
}

export default Story

const Example = ({ imageSrc }: Partial<ImageCropperProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>{' '}
      <ImageCropper
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
        imageSrc={imageSrc || ''}
      />
    </>
  )
}
export const Default: StoryObj<typeof ImageCropper> = {
  render: args => <Example imageSrc={args.imageSrc} />,
  args: {
    imageSrc: 'https://placekitten.com/200/200'
  }
}
