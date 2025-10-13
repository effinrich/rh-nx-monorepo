import { useEffect, useState } from 'react'
import { LoremIpsum } from 'react-lorem-ipsum'
import { DarkMode } from '@chakra-ui/system'

import { Meta } from '@storybook/react'

import { Box, rh, Stack, Text } from '../../index'

import { Skeleton, SkeletonCircle, SkeletonText } from './skeleton'

export default {
  component: Skeleton,
  title: 'Components / Feedback / Skeleton',
  decorators: [
    story => (
      <Box mx="auto" maxW="900px" w="full" mt={24}>
        {story()}
      </Box>
    )
  ]
} as Meta<typeof Skeleton>

export const Basic = () => (
  <Skeleton h="20px">
    <Text>Basic as basic gets</Text>
  </Skeleton>
)

export const TextLines = () => (
  <SkeletonText
    padding="20px"
    borderWidth="1px"
    borderRadius="lg"
    noOfLines={[3, 4, 5, 6, 7]}
  >
    <LoremIpsum p={2} avgSentencesPerParagraph={4} />
  </SkeletonText>
)

export const AsContainer = () => (
  <Skeleton>
    <span>Redesign UI is dope</span>
  </Skeleton>
)

export const WithFitContent = () => (
  <Skeleton fitContent>
    <span>Redesign UI is dope</span>
  </Skeleton>
)

export const WithFade = () => {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <Skeleton isLoaded={hasLoaded}>
      <span>Redesign UI is dope</span>
    </Skeleton>
  )
}

export const WithFadeText = () => {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <SkeletonText isLoaded={hasLoaded}>
      <span>Redesign UI is dope</span>
    </SkeletonText>
  )
}

export const WithFadeAlreadyLoaded = () => {
  return (
    <Skeleton isLoaded>
      <span>This should not fade in</span>
    </Skeleton>
  )
}

export const WithNoFade = () => {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <Skeleton fadeDuration={0} isLoaded={hasLoaded}>
      <span>Redesign UI is dope</span>
    </Skeleton>
  )
}

export const Circle = () => <SkeletonCircle />

export const Combined = () => (
  <rh.div padding="6" boxShadow="lg" bg="white">
    <SkeletonCircle size="10" />
    <SkeletonText mt="4" noOfLines={4} spacing="4" />
  </rh.div>
)

export const WithIsLoaded = () => {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => setHasLoaded(x => !x), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <rh.div>
      <rh.div h="100px" borderWidth="1px">
        Content
      </rh.div>
      <Skeleton w="100px" isLoaded={hasLoaded} mt={2}>
        <span>Redesign UI is dope</span>
      </Skeleton>
      <SkeletonText isLoaded={hasLoaded} mt={2}>
        <p>Redesign UI is dope</p>
      </SkeletonText>
      <rh.div h="100px" borderWidth="1px" mt={2}>
        Content
      </rh.div>
    </rh.div>
  )
}

export const WithCustomSpeed = () => (
  <Skeleton boxSize="100px" speed={2.4} borderRadius="100px" />
)

export const WithDarkMode = () => (
  <DarkMode>
    <Stack>
      <rh.p>Some text</rh.p>
      <Skeleton boxSize="100px" />
      <Skeleton boxSize="100px" />
      <Skeleton boxSize="100px" />
    </Stack>
  </DarkMode>
)

export const WithStartAndEndColor = () => (
  <Skeleton h="20px" startColor="red.200" endColor="green.200" />
)
