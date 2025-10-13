import { Badge } from '../badge/badge'
import { Box } from '../box/box'
import { Text } from '../text/text'

import { Wrap, WrapItem } from './wrap'

export default {
  component: Wrap,
  subcomponent: WrapItem,
  title: 'Components / Layout / Wrap'
}

export const Basic = () => (
  <Wrap spacing={['5', '8', '56px']}>
    <WrapItem>
      <Badge>Badge 1</Badge>
    </WrapItem>
    <WrapItem>
      <Badge>Badge 2</Badge>
    </WrapItem>
    <WrapItem>
      <Badge>Badge 3</Badge>
    </WrapItem>
    <WrapItem>
      <Badge>Badge 4</Badge>
    </WrapItem>
  </Wrap>
)

const Placeholder = (args: any) => (
  <WrapItem>
    <div
      style={{ height: 48, width: args.width || 48, background: 'red' }}
      {...args}
    />
  </WrapItem>
)

export const WithPlaceholder = () => (
  <Wrap bg="pink" spacing={5}>
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
  </Wrap>
)

export const Responsive = () => (
  <Wrap spacing={['12px', '24px']} justify={['center', 'flex-start']}>
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
  </Wrap>
)

export const HorizontalAndVertical = () => (
  <Wrap bg="pink" spacingY={['0px', '24px']} spacingX={['4px', '12px']}>
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
    <Placeholder />
  </Wrap>
)

export const WithZeroXSpacing = () => (
  <Box>
    <Text>Welcome</Text>
    <Box bg="pink">
      <Wrap maxW="200px" spacingX={20} spacingY={4}>
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </Wrap>
    </Box>
    <Text>Welcome</Text>
  </Box>
)
