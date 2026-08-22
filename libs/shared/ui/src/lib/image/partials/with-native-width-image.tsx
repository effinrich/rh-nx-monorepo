import { Image } from '../image'

export function WithNativeWidthImage() {
  return (
    <Image
      src="https://bit.ly/dan-abramov"
      fallbackSrc="https://via.placeholder.com/240"
      htmlWidth="300px"
      htmlHeight="300px"
      onLoad={() => {
        // eslint-disable-next-line no-console
        console.log('loaded')
      }}
    />
  )
}
