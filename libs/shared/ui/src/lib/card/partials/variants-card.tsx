import { Heading, Stack, Text } from '../../../index'

import { CardBody, CardHeader, CardRoot } from '../card'

export function VariantsCard() {
  return (
    <Stack gap="4">
      {['elevated', 'outline', 'filled', 'unstyled'].map(variant => (
        <CardRoot key={variant} variant={variant}>
          <CardHeader>
            <Heading size="md"> {variant}</Heading>
          </CardHeader>
          <CardBody>
            <Text>variant = {variant}</Text>
          </CardBody>
        </CardRoot>
      ))}
    </Stack>
  )
}
