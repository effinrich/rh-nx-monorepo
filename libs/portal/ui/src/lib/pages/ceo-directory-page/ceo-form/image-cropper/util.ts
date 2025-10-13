import { Area } from 'react-easy-crop'

const OUTPUT_IMAGE_EXT = 'webp'
const OUTPUT_IMAGE_TYPE = `image/${OUTPUT_IMAGE_EXT}`
const OUTPUT_IMAGE_QUALITY = 0.2

/**
 * prepare file for upload
 */
const blobToFile = (blob: Blob | null) => {
  const fileBits = blob ? [blob] : []
  const filename = `${new Date().toISOString()}.${OUTPUT_IMAGE_EXT}`
  return new File(fileBits, filename, {
    lastModified: Date.now()
  })
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.src = url
  })

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<File | null> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // set canvas size to match the bounding box
  canvas.width = image.width
  canvas.height = image.height

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')

  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise(resolve => {
    croppedCanvas.toBlob(
      blob => {
        resolve(blobToFile(blob))
      },
      OUTPUT_IMAGE_TYPE,
      OUTPUT_IMAGE_QUALITY
    )
  })
}
