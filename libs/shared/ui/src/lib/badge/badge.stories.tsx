import { Box } from '../box/box'

import { Badge } from './badge'

export default {
  component: Badge,
  title: 'Components / Data Display / Badge',
  argTypes: {
    variant: {
      options: ['subtle', 'solid', 'outline'],
      control: { type: 'radio' }
    },
    colorPalette: {
      options: [
        'gray',
        'primary',
        'whiteAlpha',
        'blackAlpha',
        'gray',
        'red',
        'orange',
        'yellow',
        'green',
        'cyan',
        'facebook',
        'teal'
      ],
      control: { type: 'select' }
    }
  },
  decorators: [
    (story: any) => (
      <Box maxW="600px" mx="auto" mt="40px">
        {story()}
      </Box>
    )
  ]
}

export const Basic = {
  render: (args: any) => <Badge {...args}>Success, man!</Badge>
}

export const SolidBadge = {
  render: (args: any) => {
    return (
      <>
        {['gray', 'green', 'red', 'orange', 'purple', 'teal'].map(
          colorPalette => (
            <Badge
              key={colorPalette}
              colorPalette={colorPalette}
              variant="solid"
              mr={2}
              {...args}
            >
              {colorPalette}
            </Badge>
          )
        )}
      </>
    )
  }
}

export const SubtleBadges = {
  render: (args: any) => (
    <>
      {['gray', 'green', 'red', 'orange', 'purple', 'teal'].map(colorPalette => (
        <Badge
          key={colorPalette}
          colorPalette={colorPalette}
          mr={2}
          {...args}
          variant="subtle"
        >
          {colorPalette}
        </Badge>
      ))}
    </>
  )
}

export const OutlineBadges = {
  render: (args: any) => (
    <>
      {['gray', 'green', 'red', 'orange', 'purple', 'teal'].map(colorPalette => (
        <Badge
          key={colorPalette}
          colorPalette={colorPalette}
          variant="outline"
          mr={2}
          {...args}
        >
          {colorPalette}
        </Badge>
      ))}
    </>
  )
}
