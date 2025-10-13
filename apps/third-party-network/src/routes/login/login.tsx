import { useTitle } from 'react-use'
import { Login as UserLogin } from '@redesignhealth/third-party-network/features/authentication'
import { Box, Flex, Grid, RedesignLogo } from '@redesignhealth/ui'

import { Graphic } from './components/graphic'

export const Login = () => {
  useTitle('RH Advise | Log In')

  return (
    <Grid templateColumns="1fr 1fr" h="100%" gap="40px">
      <Flex flexDir="column">
        <Box as="header" mb="auto">
          <RedesignLogo alt="Redesign Health" />
        </Box>
        <Box as="main" mb="auto">
          <UserLogin />
        </Box>
      </Flex>
      <Graphic />
    </Grid>
  )
}
