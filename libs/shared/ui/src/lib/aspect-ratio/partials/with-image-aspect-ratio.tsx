import { AspectRatio } from '../aspect-ratio'

export function WithImageAspectRatio() {
  return (
    <AspectRatio maxWidth="400px" ratio={4 / 3}>
      <img
        src="https://upload.wikimedia.org/wikipedia/en/7/7d/Minions_characters.png"
        alt="minions"
      />
    </AspectRatio>
  )
}
