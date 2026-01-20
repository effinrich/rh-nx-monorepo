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
    disabled: { type: 'boolean' },
    loading: { type: 'boolean' },
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
    colorPalette: {
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
    colorPalette: 'primary',
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
  colorPalette?: string
  variant?: string
  size?: string
}

export const Basic: StoryObj<StoryProps> = {
  args: {
    children: 'Button',
    colorPalette: 'primary',
    variant: 'solid'
  }
}

export const Outlines: StoryObj<StoryProps> = {
  render: props => (
    <>
      <Button {...props} variant="outline" colorPalette="red" />
      <Button {...props} variant="outline" colorPalette="green" />
      <Button {...props} variant="outline" colorPalette="blue" />
      <Button {...props} variant="outline" colorPalette="teal" />
      <Button {...props} variant="outline" colorPalette="pink" />
      <Button {...props} variant="outline" colorPalette="purple" />
      <Button {...props} variant="outline" colorPalette="cyan" />
      <Button {...props} variant="outline" colorPalette="orange" />
      <Button {...props} variant="outline" colorPalette="yellow" />
      <Button {...props} variant="outline" colorPalette="zap" />
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
  <HStack gap="24px">
    <Button colorPalette="primary">Primary</Button>
    <Button variant="primary-on-accent">Primary on accent</Button>
    <Button variant="outline">Secondary</Button>
    {/* <Button variant="secondary-on-accent">Secondary on accent</Button> */}
    <Button colorPalette="teal" variant="solid">
      Solid
    </Button>
    <Button colorPalette="teal" variant="outline">
      Outline
    </Button>
    <Button colorPalette="teal" variant="ghost">
      Ghost
    </Button>
    {/* <Button colorPalette="teal" variant="ghost-on-accent">
      Ghost on accent
    </Button> */}
    <Button colorPalette="teal" variant="link">
      Link
    </Button>
    <Button colorPalette="teal" variant="unstyled">
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
        <Button colorPalette="whiteAlpha">WhiteAlpha</Button>
        <Button colorPalette="blackAlpha">BlackAlpha</Button>
      </ButtonGroup>
    </Box>

    <Wrap gap={4}>
      <WrapItem>
        <Button colorPalette="gray">Gray</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="primary">Primary</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="zap">Zap</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="red">Red</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="orange">Orange</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="yellow">Yellow</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="green">Green</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="teal">Teal</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="blue">Blue</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="cyan">Cyan</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="purple">Purple</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="pink">Pink</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="linkedin">Linkedin</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="facebook">Facebook</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="messenger">Messenger</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="whatsapp">Whatsapp</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="twitter">Twitter</Button>
      </WrapItem>
      <WrapItem>
        <Button colorPalette="telegram">Telegram</Button>
      </WrapItem>
    </Wrap>
  </Stack>
)

export const WithSizes = () => (
  <HStack>
    <Button colorPalette="blue" size="xs">
      Button
    </Button>
    <Button colorPalette="blue" size="sm">
      Button
    </Button>
    <Button colorPalette="blue" size="md">
      Button
    </Button>
    <Button colorPalette="blue" size="lg">
      Button
    </Button>
  </HStack>
)

export const WithIcon = () => (
  <Stack direction="row" gap={4}>
    <Button leftIcon={<LuMail />} colorPalette="teal" variant="solid">
      Email
    </Button>
    <Button
      rightIcon={<LuArrowRight />}
      colorPalette="teal"
      variant="outline"
    >
      Call us
    </Button>
  </Stack>
)

export const WithReactIcons = () => (
  <Stack direction="row" gap={4} align="center">
    <Button leftIcon={<MdBuild />} colorPalette="pink" variant="solid">
      Settings
    </Button>
    <Button rightIcon={<MdCall />} colorPalette="blue" variant="outline">
      Call us
    </Button>
  </Stack>
)

export const WithLoadingState = () => (
  <Stack direction="row" gap={4}>
    <Button loading colorPalette="teal" variant="solid">
      Email
    </Button>
    <Button
      loading
      loadingText="Submitting"
      colorPalette="teal"
      variant="outline"
    >
      Submit
    </Button>
  </Stack>
)

export const WithCustomLoadingState = () => (
  <Button
    loading
    colorPalette="blue"
    spinner={<BeatLoader size={8} color="white" />}
  >
    Click me
  </Button>
)

export const WithLoadingSpinnerPlacement = () => (
  <Stack direction="row" gap={4} align="center">
    <Button
      loading
      loadingText="Loading"
      colorPalette="teal"
      variant="outline"
      spinnerPlacement="start"
    >
      Submit
    </Button>
    <Button
      loading
      loadingText="Loading"
      colorPalette="teal"
      variant="outline"
      spinnerPlacement="end"
    >
      Continue
    </Button>
  </Stack>
)

export const WithDisabled = () => (
  <HStack gap="24px">
    <Button disabled colorPalette="teal" variant="solid">
      Button
    </Button>
    <Button disabled colorPalette="teal" variant="outline">
      Button
    </Button>
    <Button disabled colorPalette="teal" variant="ghost">
      Button
    </Button>
    <Button disabled colorPalette="teal" variant="link">
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
      colorPalette="blue"
      aria-label="Search database"
      icon={<LuSearch />}
    />

    <IconButton colorPalette="teal" aria-label="Call Segun" size="lg">
      <LuPhone />
    </IconButton>
  </Stack>
)

export const WithButtonGroup = () => (
  <ButtonGroup variant="outline">
    <Button colorPalette="blue">Save</Button>
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
    <Button colorPalette="facebook" leftIcon={<MdFacebook />}>
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
