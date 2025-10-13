import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { MdImage } from 'react-icons/md'
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack
} from '@redesignhealth/ui'

import { getCroppedImg } from './util'

export interface ImageCropperProps {
  isOpen: boolean
  onClose(): void
  onSuccess(croppedFile: File | null): void
  imageSrc: string
}

const ImageCropper = ({
  isOpen,
  onClose,
  onSuccess,
  imageSrc
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1.2)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adjust photo</ModalHeader>
        <Divider />
        <ModalBody px={10}>
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
            <Slider
              colorScheme="primary"
              aria-label="slider-ex-1"
              value={zoom}
              min={1}
              step={0.1}
              max={3}
              onChange={setZoom}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Icon as={MdImage} boxSize={8} />
          </HStack>
        </ModalBody>
        <Divider />
        <ModalFooter gap="3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="primary"
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ImageCropper
