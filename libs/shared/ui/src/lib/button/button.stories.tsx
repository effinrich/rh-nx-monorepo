import { ReactNode, useState } from 'react'
import { MdBuild, MdCall, MdFacebook } from 'react-icons/md'
import {
  LuArrowRight,
  LuChevronDown,
  LuMail,
  LuPhone,
  LuSearch
} from 'react-icons/lu'
import { BeatLoader } from 'react-spinners'
import { Box, HStack, Stack, Wrap, WrapItem } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import { Meta, StoryObj } from '@storybook/react-vite'

import { IconButton } from '../icon-button/icon-button'

import { Button, ButtonGroup } from './button'

export default {
  component: Button,
  title: 'Components / Forms / Button',
  argTypes: {
    iconSpacing: { type: 'string' },
    children: { type: 'string' },
    loadingText: { type: 'string' },
    isActive: { type: 'boolean' },
    isDisabled: { type: 'boolean' },
    isLoading: { type: 'boolean' },
    leftIcon: { type: 'function' },
    // isRound: { type: 'boolean' },
    rightIcon: { type: 'function' },
    'aria-label': { type: 'string' },
    variant: {
      options: ['solid', 'outline', 'ghost', 'link', 'unstyled'],
      control: { type: 'radio' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'radio' }
    },
    spinnerPlacement: {
      options: ['end', 'start'],
      control: { type: 'radio' }
    },
    colorScheme: {
      options: [
        'primary',
        'blackAlpha',
        'gray',
        'red',
        'orange',
        'green',
        'facebook',
        'teal'
      ],
      control: { type: 'select' }
    }
  },
  args: {
    'aria-label': 'button action',
    colorScheme: 'primary',
    size: 'md',
    variant: 'solid'
  }
  // decorators: [
  //   Story => (
  //     <Box display="flex" flexWrap="wrap" gap="4" justifyContent="center">
  //       {Story()}
  //     </Box>
  //   )
  // ]
} as Meta<typeof Button>

interface StoryProps {
  children?: ReactNode
  colorScheme?: string
  variant?: string
  size?: string
}

export const Basic: StoryObj<StoryProps> = {
  args: {
    children: 'Button',
    colorScheme: 'primary',
    variant: 'solid'
  }
}

export const Outlines: StoryObj<StoryProps> = {
  render: props => (
    <>
      <Button {...props} variant="outline" colorScheme="red" />
      <Button {...props} variant="outline" colorScheme="green" />
      <Button {...props} variant="outline" colorScheme="blue" />
      <Button {...props} variant="outline" colorScheme="teal" />
      <Button {...props} variant="outline" colorScheme="pink" />
      <Button {...props} variant="outline" colorScheme="purple" />
      <Button {...props} variant="outline" colorScheme="cyan" />
      <Button {...props} variant="outline" colorScheme="orange" />
      <Button {...props} variant="outline" colorScheme="yellow" />
      <Button {...props} variant="outline" colorScheme="zap" />
    </>
  ),

  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'radio' }
    }
  },

  args: {
    children: 'Button'
  }
}

export const WithVariants = () => (
  <HStack spacing="24px">
    <Button colorScheme="primary">Primary</Button>
    <Button variant="primary-on-accent">Primary on accent</Button>
    <Button variant="outline">Secondary</Button>
    {/* <Button variant="secondary-on-accent">Secondary on accent</Button> */}
    <Button colorScheme="teal" variant="solid">
      Solid
    </Button>
    <Button colorScheme="teal" variant="outline">
      Outline
    </Button>
    <Button colorScheme="teal" variant="ghost">
      Ghost
    </Button>
    {/* <Button colorScheme="teal" variant="ghost-on-accent">
      Ghost on accent
    </Button> */}
    <Button colorScheme="teal" variant="link">
      Link
    </Button>
    <Button colorScheme="teal" variant="unstyled">
      Unstyled
    </Button>
  </HStack>
)

export const WithColors = () => (
  <Stack direction="column">
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      py={12}
      bgImage="url('https://bit.ly/2Z4KKcF')"
      bgPosition="center"
      bgRepeat="no-repeat"
      mb={2}
    >
      <ButtonGroup gap="4">
        <Button colorScheme="whiteAlpha">WhiteAlpha</Button>
        <Button colorScheme="blackAlpha">BlackAlpha</Button>
      </ButtonGroup>
    </Box>

    <Wrap spacing={4}>
      <WrapItem>
        <Button colorScheme="gray">Gray</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="primary">Primary</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="zap">Zap</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="red">Red</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="orange">Orange</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="yellow">Yellow</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="green">Green</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="teal">Teal</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="blue">Blue</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="cyan">Cyan</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="purple">Purple</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="pink">Pink</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="linkedin">Linkedin</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="facebook">Facebook</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="messenger">Messenger</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="whatsapp">Whatsapp</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="twitter">Twitter</Button>
      </WrapItem>
      <WrapItem>
        <Button colorScheme="telegram">Telegram</Button>
      </WrapItem>
    </Wrap>
  </Stack>
)

export const WithSizes = () => (
  <HStack>
    <Button colorScheme="blue" size="xs">
      Button
    </Button>
    <Button colorScheme="blue" size="sm">
      Button
    </Button>
    <Button colorScheme="blue" size="md">
      Button
    </Button>
    <Button colorScheme="blue" size="lg">
      Button
    </Button>
  </HStack>
)

export const WithIcon = () => (
  <Stack direction="row" spacing={4}>
    <Button leftIcon={<LuMail />} colorScheme="teal" variant="solid">
      Email
    </Button>
    <Button
      rightIcon={<LuArrowRight />}
      colorScheme="teal"
      variant="outline"
    >
      Call us
    </Button>
  </Stack>
)

export const WithReactIcons = () => (
  <Stack direction="row" spacing={4} align="center">
    <Button leftIcon={<MdBuild />} colorScheme="pink" variant="solid">
      Settings
    </Button>
    <Button rightIcon={<MdCall />} colorScheme="blue" variant="outline">
      Call us
    </Button>
  </Stack>
)

export const WithLoadingState = () => (
  <Stack direction="row" spacing={4}>
    <Button isLoading colorScheme="teal" variant="solid">
      Email
    </Button>
    <Button
      isLoading
      loadingText="Submitting"
      colorScheme="teal"
      variant="outline"
    >
      Submit
    </Button>
  </Stack>
)

export const WithCustomLoadingState = () => (
  <Button
    isLoading
    colorScheme="blue"
    spinner={<BeatLoader size={8} color="white" />}
  >
    Click me
  </Button>
)

export const WithLoadingSpinnerPlacement = () => (
  <Stack direction="row" spacing={4} align="center">
    <Button
      isLoading
      loadingText="Loading"
      colorScheme="teal"
      variant="outline"
      spinnerPlacement="start"
    >
      Submit
    </Button>
    <Button
      isLoading
      loadingText="Loading"
      colorScheme="teal"
      variant="outline"
      spinnerPlacement="end"
    >
      Continue
    </Button>
  </Stack>
)

export const WithDisabled = () => (
  <HStack spacing="24px">
    <Button isDisabled colorScheme="teal" variant="solid">
      Button
    </Button>
    <Button isDisabled colorScheme="teal" variant="outline">
      Button
    </Button>
    <Button isDisabled colorScheme="teal" variant="ghost">
      Button
    </Button>
    <Button isDisabled colorScheme="teal" variant="link">
      Button
    </Button>
  </HStack>
)

export const CustomComposition = () => (
  <Button
    size="md"
    height="48px"
    width="200px"
    border="2px solid"
    borderColor="green.500"
  >
    Button
  </Button>
)

export const ButtonWithIcon = () => (
  <Stack direction="row">
    <IconButton aria-label="Search database" icon={<LuSearch />} />

    <IconButton
      colorScheme="blue"
      aria-label="Search database"
      icon={<LuSearch />}
    />

    <IconButton colorScheme="teal" aria-label="Call Segun" size="lg">
      <LuPhone />
    </IconButton>
  </Stack>
)

export const WithButtonGroup = () => (
  <ButtonGroup variant="outline">
    <Button colorScheme="blue">Save</Button>
    <Button>Cancel</Button>
  </ButtonGroup>
)

export const WithAttachedButtons = () => (
  <ButtonGroup size="sm" isAttached variant="outline">
    <Button>Save</Button>
    <Button>Cancel</Button>
    <IconButton
      fontSize="2xl"
      aria-label="Add to friends"
      icon={<LuChevronDown />}
    />
  </ButtonGroup>
)

export const WithSocialButton = () => (
  <Stack direction="row">
    <Button colorScheme="facebook" leftIcon={<MdFacebook />}>
      Facebook
    </Button>
  </Stack>
)

const motionConfig = {
  initial: false,
  transition: {
    type: 'spring',
    duration: 2,
    bounce: 0
  }
}

const MotionButton = motion(Button)
const BG_GRADIENT_SOFT = `linear-gradient(to right, #fa8080, #F40000)`
const BG_GRADIENT_SOFT_REVERSED = `linear-gradient(to right, #F40000, #fa8080)`

export const WithMotion = () => {
  const [binary, setBinary] = useState(false)
  return (
    <>
      <Button onClick={() => setBinary(binary => !binary)}>
        Toggle binary state: {String(binary)}
      </Button>
      <MotionButton
        {...motionConfig}
        animate={{
          scale: binary ? 1.2 : 1,
          backgroundImage: binary ? BG_GRADIENT_SOFT : BG_GRADIENT_SOFT_REVERSED
        }}
      >
        ({String(binary)}) Doesn't work
      </MotionButton>
    </>
  )
}
