import { Meta, StoryObj } from '@storybook/react-vite'

import { HStack } from '../../index'

import {
  Stat,
  StatDownIndicator,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatUpIndicator
} from './stat'

export default {
  component: Stat,
  title: 'Components / Data Display / Stat'
} as Meta<typeof Stat>

export const Default: StoryObj<typeof Stat> = {
  render: args => (
    <Stat>
      <StatLabel>Collected Fees</StatLabel>
      <StatNumber>$0.00</StatNumber>
      <StatHelpText>Feb 12 - Feb 28</StatHelpText>
    </Stat>
  )
}

export const StatWithIndicator: StoryObj<typeof Stat> = {
  render: args => (
    <HStack gap="4">
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatUpIndicator />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Clicked</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatDownIndicator />
          9.05%
        </StatHelpText>
      </Stat>
    </HStack>
  )
}
