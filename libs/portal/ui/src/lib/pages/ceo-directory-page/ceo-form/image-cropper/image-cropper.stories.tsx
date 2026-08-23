import { Button, useDisclosure } from '@redesignhealth/ui'
import { withRouter } from 'storybook-addon-remix-react-router'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ImageCropper, { ImageCropperProps } from './image-cropper'

const Story: Meta<typeof ImageCropper> = {
  component: ImageCropper,
  title: 'Components / ImageCropper',
  decorators: [withRouter],
  args: {}
}

export default Story

const Example = ({ imageSrc }: Partial<ImageCropperProps>) => {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Dialog</Button>{' '}
      <ImageCropper
        open={open}
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
