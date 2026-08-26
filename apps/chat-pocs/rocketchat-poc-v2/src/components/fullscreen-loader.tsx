import { Box, Container, Spinner } from '@redesignhealth/ui'

export const FullScreenLoader = () => (
  <Container h="95vh">
    <Box display="flex" alignItems="center" justifyContent="center" h="full">
      <Spinner />
    </Box>
  </Container>
)

export default FullScreenLoader
