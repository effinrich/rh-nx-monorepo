import { Image } from '../image'

export function FallbackElementExampleImage() {
  return (
    <Image
      src="https://bit.ly/dan-abramov"
      fallback={<div style={{ width: 240, height: 240, background: 'red' }} />}
    />
  )
}
