import { AvatarFallback, AvatarImage, AvatarRoot } from '../avatar'

export function WithSrcSetAvatar() {
  const small =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_300.jpg'
  const medium =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_768.jpg'
  const large =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_1280.jpg'
  const xlarge =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_3200.jpg'

  return (
    <AvatarRoot>
      {/* @ts-expect-error Chakra v3 compound component typing */}
      <AvatarImage
        src={small}
        srcSet={`${small} 300w, ${medium} 768w, ${large} 1280w, ${xlarge} 3200w`}
      />
      <AvatarFallback name="Uchiha Itachi" />
    </AvatarRoot>
  )
}
