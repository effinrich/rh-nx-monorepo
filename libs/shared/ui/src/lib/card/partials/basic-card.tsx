import { Heading, Text } from '../../../index'

import { CardBody, CardHeader, CardRoot } from '../card'

export function BasicCard() {
  return (
    <CardRoot>
      <CardHeader>
        <Heading size="md"> Customer dashboard</Heading>
      </CardHeader>
      <CardBody>
        <Text>View a summary of all your customers over the last month.</Text>
      </CardBody>
    </CardRoot>
  )
}
