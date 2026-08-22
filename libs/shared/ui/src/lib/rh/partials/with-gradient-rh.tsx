import { rh } from '../rh'

export function WithGradientRh() {
  return (
    <>
      <rh.div
        bgGradient="to-r"
        gradientFrom="pink.300"
        gradientTo="blue.500"
        w="500px"
        h="64px"
      />
      <rh.span
        bgGradient="to-r"
        gradientFrom="red.200"
        gradientTo="papayawhip"
        bgClip="text"
        fontSize="7xl"
        fontWeight="extrabold"
      >
        Welcome to Chakra UI
      </rh.span>
    </>
  )
}
