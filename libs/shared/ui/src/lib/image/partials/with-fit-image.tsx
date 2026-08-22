import { Image } from '../image'

export function WithFitImage() {
  return (
    <Image
      src="https://bit.ly/dan-abramov"
      fallbackSrc="https://via.placeholder.com/240"
      fit="cover"
      width="400px"
      height="300px"
    />
  )
}
