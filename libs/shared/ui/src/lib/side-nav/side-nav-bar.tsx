// import { Outlet } from 'react-router-dom'
import { useBreakpointValue } from '@chakra-ui/react'

import { Container } from '../container/container'
import { Flex } from '../flex/flex'
import { Heading } from '../heading/heading'
import { Stack } from '../stack/stack'
import { Text } from '../text/text'

// import { Card } from '../card/card'
import { SideNav } from './side-nav'

export const SideNavBar = ({ router }: any) => {
  return (
    <Flex
      as="section"
      direction={{ base: 'column', lg: 'row' }}
      height="100vh"
      bg="bg-canvas"
      overflowY="auto"
    >
      <SideNav router={router} />
      <Container py="8" flex="1">
        <Stack spacing={{ base: '8', lg: '6' }}>
          <Stack
            spacing="4"
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align={{ base: 'start', lg: 'center' }}
          >
            <Stack spacing="1">
              <Heading
                size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
                fontWeight="medium"
              >
                Dashboard
              </Heading>
              <Text color="muted">All important metrics at a glance</Text>
            </Stack>
          </Stack>
          {/* <Outlet /> */}
          {/* <Stack spacing={{ base: '5', lg: '6' }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
              <Card />
              <Card />
              <Card />
            </SimpleGrid>
          </Stack> */}
          {/* <Card minH="sm" /> */}
        </Stack>
      </Container>
    </Flex>
  )
}

export default SideNavBar
