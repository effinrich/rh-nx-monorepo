import { Box } from '../box'

export function BasicBox() {
  return (
    <Box>
      <Box color="tomato" _hover={{ bg: 'red.500', color: 'white' }}>
        Just a box
      </Box>
      <Box
        position="relative"
        bg="red.400"
        _before={{
          height: 0,
          content: `""`,
          display: 'block',
          paddingBottom: ['40px', '100px']
        }}
      />
    </Box>
  )
}
