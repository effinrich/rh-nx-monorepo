import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { MdImage } from 'react-icons/md'
import {
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  HStack,
  Icon,
  Separator,
  SliderControl,
  SliderRange,
  SliderRoot,
  SliderThumbs,
  SliderTrack
} from '@redesignhealth/ui'

import { getCroppedImg } from './util'

export interface ImageCropperProps {
  open: boolean
  onClose(): void
  onSuccess(croppedFile: File | null): void
  imageSrc: string
}

const ImageCropper = ({
  open,
  onClose,
  onSuccess,
  imageSrc
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1.2)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  return (
    <DialogRoot
      size="xl"
      open={open}
      onOpenChange={(e: { open: boolean }) => {
        if (!e.open) onClose()
      }}
    >
      <DialogBackdrop />
      {/* @ts-expect-error Chakra v3 children typing */}
      <DialogPositioner>
        {/* @ts-expect-error Chakra v3 children typing */}
        <DialogContent maxW="48rem">
          <DialogHeader>
            {/* @ts-expect-error Chakra v3 DialogTitle children typing */}
            <DialogTitle>Adjust photo</DialogTitle>
          </DialogHeader>
          <Separator />
          <DialogBody px={10}>
            <Box position="relative" h={400} my={4}>
              <Cropper
                image={imageSrc}
                crop={crop}
                showGrid={false}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
                zoom={zoom}
                cropShape="round"
              />
            </Box>
            <HStack gap={6} pt={4} pb={8}>
              <Icon as={MdImage} boxSize={6} />
              <SliderRoot
                colorPalette="primary"
                aria-label="slider-ex-1"
                value={[zoom]}
                min={1}
                step={0.1}
                max={3}
                onValueChange={({ value }) => setZoom(value[0] ?? zoom)}
              >
                <SliderControl>
                  <SliderTrack>
                    <SliderRange />
                  </SliderTrack>
                  <SliderThumbs />
                </SliderControl>
              </SliderRoot>
              <Icon as={MdImage} boxSize={8} />
            </HStack>
          </DialogBody>
          <Separator />
          <DialogFooter gap="3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorPalette="primary"
              onClick={async () => {
                if (croppedAreaPixels) {
                  const croppedFile = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels
                  )
                  onSuccess(croppedFile)
                }
                onClose()
              }}
            >
              Save picture
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}

export default ImageCropper
