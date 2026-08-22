import { Heading, Stack, Text } from '../../../index'

import { CardBody, CardHeader, CardRoot } from '../card'

export function SizesCard() {
  return (
    <Stack gap="4">
      {['sm', 'md', 'lg'].map(size => (
        <CardRoot key={size} size={size}>
          <CardHeader>
            <Heading size="md"> {size}</Heading>
          </CardHeader>
          <CardBody>
            <Text>size = {size}</Text>
          </CardBody>
        </CardRoot>
      ))}
    </Stack>
  )
}
