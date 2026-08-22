import { rh } from '../rh'

export function WithHeadingRh() {
  return (
    <div>
      <rh.h1
        fontSize={['50px', '80px', '100px']}
        color="tomato"
        css={{ color: 'teal.500' }}
      >
        Welcome
      </rh.h1>
    </div>
  )
}
