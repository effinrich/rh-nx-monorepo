import { Image } from '../image'

export function FallbackStrategiesImage() {
  return (
    <>
      <Image
        src="https://via.placeholder.com/240"
        w={240}
        h={240}
        fallbackStrategy="onError"
        fallbackSrc="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      />
      <Image
        w={240}
        h={240}
        src="https://via.placeholder.com/240"
        fallbackStrategy="beforeLoadOrError"
        fallbackSrc="https://bit.ly/dan-abramov"
      />
    </>
  )
}
