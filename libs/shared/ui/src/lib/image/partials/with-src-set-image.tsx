import { useRef } from 'react'

import { Image } from '../image'

export function WithSrcSetImage() {
  const firstRef = useRef<HTMLImageElement>(null)
  const secondRef = useRef<HTMLImageElement>(null)

  const firstLog = (e: { type: string }) => {
    // eslint-disable-next-line no-console
    console.log(1, 'Image', e.type, firstRef.current?.currentSrc)
  }

  const secondLog = (e: { type: string }) => {
    // eslint-disable-next-line no-console
    console.log(2, 'Img', e.type, secondRef.current?.currentSrc)
  }

  return (
    <>
      <Image
        ref={firstRef}
        srcSet="//fake.image/ 1x"
        onError={firstLog}
        onLoad={firstLog}
      />
      <Image
        ref={secondRef}
        srcSet="//lorempixel.com/100/100/ 1x"
        onError={secondLog}
        onLoad={secondLog}
      />
    </>
  )
}
