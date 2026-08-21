import { useRef, useState } from 'react'
import { useCreateAsset } from '@redesignhealth/portal/data-assets'
import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  Button,
  HStack,
  Loader,
  Stack,
  Text,
  useDisclosure
} from '@redesignhealth/ui'

import ImageCropper from '../image-cropper/image-cropper'

interface HeadshotUploaderProps {
  onClear(): void
  href?: string
  onUploadComplete(cdnUrl: string): void
}

const HeadshotUploader = ({
  onUploadComplete,
  onClear,
  href
}: HeadshotUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    isPending: isPictureUploading,
    mutate: uploadPicture,
    isError: isUploadError
  } = useCreateAsset()

  const [newFileDataUrl, setNewFileDataUrl] = useState<string>()
  const [fileValue, setFileValue] = useState<string>('')
  const uploadModal = useDisclosure()

  return (
    <>
      <HStack gap="8">
        <input
          hidden
          type="file"
          ref={inputRef}
          value={fileValue}
          onChange={event => {
            setFileValue(event.target.value)
            const file = event.target?.files?.[0]
            if (file) {
              const fr = new FileReader()
              fr.onload = event => {
                setNewFileDataUrl(event.target?.result?.toString())
                uploadModal.onOpen()
              }
              fr.readAsDataURL(file)
            }
          }}
        />
        {isPictureUploading ? (
          <Loader size="xl" minHeight="96px" w="96px" flex="inherit" />
        ) : (
          <AvatarRoot size="xl" bg="gray.400">
            {/* @ts-expect-error Chakra v3 compound component typing */}
            <AvatarImage src={href} />
            <AvatarFallback />
          </AvatarRoot>
        )}

        <Stack align="flex-start" gap="2" justify="center">
          <Button
            variant="plain"
            colorPalette="primary"
            onClick={() => {
              if (inputRef.current) {
                // reset value so we can trigger file->onChange event
                setFileValue('')
                inputRef.current?.click()
              }
            }}
          >
            Click to upload an image
          </Button>
          <Button
            variant="plain"
            onClick={() => {
              setFileValue('')
              onClear()
            }}
            color="gray.400"
          >
            Clear image
          </Button>
          {isUploadError && (
            <Text color="red">Unable to upload image at this time</Text>
          )}
        </Stack>
      </HStack>
      {uploadModal.open && newFileDataUrl && (
        <ImageCropper
          imageSrc={newFileDataUrl}
          open={uploadModal.open}
          onClose={uploadModal.onClose}
          onSuccess={croppedFile => {
            if (croppedFile) {
              uploadPicture(croppedFile, {
                onSuccess: asset => onUploadComplete(asset.href)
              })
            }
          }}
        />
      )}
    </>
  )
}
export default HeadshotUploader
