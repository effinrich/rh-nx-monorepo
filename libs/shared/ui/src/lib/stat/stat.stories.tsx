import { Meta, StoryObj } from '@storybook/react-vite'

import {
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber
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
    <StatGroup>
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Clicked</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type="decrease" />
          9.05%
        </StatHelpText>
      </Stat>
    </StatGroup>
  )
}
