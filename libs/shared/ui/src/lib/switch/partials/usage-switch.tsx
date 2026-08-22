import { chakra } from '@chakra-ui/react'

import { Container } from '../../../index'

import { Switch } from '../switch'

export function UsageSwitch() {
  return (
    <Container display="flex" justifyContent="center" alignItems="center">
      <chakra.label htmlFor="email-alerts" mr="16px">
        Enable email alerts?
      </chakra.label>
      <Switch id="email-alerts" />
    </Container>
  )
}
