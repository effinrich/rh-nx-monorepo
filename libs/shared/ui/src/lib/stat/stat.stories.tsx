import { Meta, StoryObj } from '@storybook/react-vite'

import { HStack } from '../../index'

import {
  StatRoot,
  StatLabel,
  StatValueText,
  StatHelpText,
  StatUpIndicator,
  StatDownIndicator
} from './stat'

export default {
  component: StatRoot,
  title: 'Components / Data Display / Stat'
} as Meta<typeof StatRoot>

export const Default: StoryObj<typeof StatRoot> = {
  render: () => (
    <StatRoot>
      <StatLabel>Collected Fees</StatLabel>
      <StatValueText>$0.00</StatValueText>
      <StatHelpText>Feb 12 - Feb 28</StatHelpText>
    </StatRoot>
  )
}

export const StatWithIndicator: StoryObj<typeof StatRoot> = {
  render: () => (
    <HStack>
      <StatRoot>
        <StatLabel>Sent</StatLabel>
        <StatValueText>345,670</StatValueText>
        <StatHelpText>
          <StatUpIndicator />
          23.36%
        </StatHelpText>
      </StatRoot>

      <StatRoot>
        <StatLabel>Clicked</StatLabel>
        <StatValueText>45</StatValueText>
        <StatHelpText>
          <StatDownIndicator />
          9.05%
        </StatHelpText>
      </StatRoot>
    </HStack>
  )
}
