import { Image } from '../image'

export function FallbackSrcExampleImage() {
  return (
    <Image
      src="https://bit.ly/dan-abramov"
      fallbackSrc="https://via.placeholder.com/240"
    />
  )
}
