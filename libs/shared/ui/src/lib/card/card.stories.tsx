import { Meta } from '@storybook/react-vite'

import { Box, Separator } from '../../index'

import { CardRoot } from './card'
import { AdvancedCard } from './partials/advanced-card'
import { BasicCard } from './partials/basic-card'
import { HorizontalCard as HorizontalCardExample } from './partials/horizontal-card'
import { SizesCard } from './partials/sizes-card'
import { VariantsCard } from './partials/variants-card'
import { WithDividerCard } from './partials/with-divider-card'
import { WithImageCard } from './partials/with-image-card'

export default {
  component: CardRoot,
  title: 'Patterns / Layout / Card',
  decorators: [
    (Story: () => unknown) => (
      <Box mx="auto" mt="40px" w="100%" maxW="2xl">
        {Story()}
      </Box>
    )
  ],
  args: {
    children: 'This is the body content.',
    as: 'h3'
  },
  argTypes: {
    variant: {
      options: ['elevated', 'outline', 'filled', 'unstyled'],
      control: { type: 'radio' }
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' }
    },
    as: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5'],
      control: { type: 'radio' }
    },
    align: {
      options: ['stretch', 'center', 'start', 'end'],
      control: { type: 'select' }
    },
    direction: {
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      control: { type: 'select' }
    },
    justify: {
      options: [
        'start',
        'center',
        'space-between',
        'space-around',
        'space-evenly'
      ],
      control: { type: 'select' }
    }
  },
  parameters: {
    controls: {
      include: ['as', 'direction', 'align', 'justify', 'variant', 'size']
    }
  }
} as Meta<typeof Separator>

export const Variants = {
  render: () => <VariantsCard />
}

export const Sizes = {
  render: () => <SizesCard />
}

export const Basic = {
  render: () => <BasicCard />
}

export const WithDivider = {
  render: () => <WithDividerCard />
}

export const WithImage = {
  render: () => <WithImageCard />
}

export const HorizontalCard = {
  render: () => <HorizontalCardExample />
}

export const Advanced = {
  render: () => <AdvancedCard />
}
