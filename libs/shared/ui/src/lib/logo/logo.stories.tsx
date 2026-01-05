import { Meta, StoryFn } from '@storybook/react-vite'

import { Box } from '../box/box'
import { HStack } from '../h-stack/h-stack'
import { VStack } from '../v-stack/v-stack'

import { Logo } from './logo'
import { RedesignHealthPrismIcon } from './redesign-health-prism'

export default {
  component: Logo,
  title: 'Components / Media / Logo'
} as Meta<typeof Logo>

export const Default = {
  args: {}
}

export const CustomSize: StoryFn<typeof Logo> = () => (
  <VStack spacing="6" align="start">
    <Logo height="4" />
    <Logo height="6" />
    <Logo height="8" />
    <Logo height="12" />
    <Logo height="16" />
  </VStack>
)

export const CustomColor: StoryFn<typeof Logo> = () => (
  <VStack spacing="6" align="start">
    <Logo color="primary.500" />
    <Logo color="secondary.500" />
    <Logo color="gray.700" />
    <Logo color="blue.500" />
  </VStack>
)

export const OnDarkBackground: StoryFn<typeof Logo> = () => (
  <Box bg="gray.900" p="8" rounded="md">
    <Logo color="white" height="12" />
  </Box>
)

export const OnColoredBackground: StoryFn<typeof Logo> = () => (
  <HStack spacing="4">
    <Box bg="primary.500" p="8" rounded="md">
      <Logo color="white" height="10" />
    </Box>
    <Box bg="secondary.500" p="8" rounded="md">
      <Logo color="white" height="10" />
    </Box>
    <Box bg="gray.100" p="8" rounded="md">
      <Logo color="gray.800" height="10" />
    </Box>
  </HStack>
)

export const WithPrismIcon: StoryFn = () => (
  <HStack spacing="6" align="center">
    <RedesignHealthPrismIcon boxSize="8" />
    <Logo height="8" />
  </HStack>
)

export const Responsive: StoryFn<typeof Logo> = () => (
  <Logo height={{ base: '6', md: '8', lg: '12' }} />
)
