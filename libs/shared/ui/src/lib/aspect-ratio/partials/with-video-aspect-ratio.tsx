import { AspectRatio } from '../aspect-ratio'

export function WithVideoAspectRatio() {
  return (
    <AspectRatio maxWidth="300px" ratio={1}>
      <iframe
        title="test"
        src="https://www.youtube.com/embed/QhBnZ6NPOY0"
        allowFullScreen
      />
    </AspectRatio>
  )
}
