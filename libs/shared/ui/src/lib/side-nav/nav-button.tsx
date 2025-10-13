import { NavLink } from 'react-router-dom'
import { As } from '@chakra-ui/react'

import { type ButtonProps, Button } from '../button/button'
import { HStack } from '../h-stack/h-stack'
import { Icon } from '../icon/icon'
import { Text } from '../text/text'

interface NavButtonProps extends ButtonProps {
  icon: As
  label: string
  path: string
}

export const NavButton = ({
  children,
  path = '/',
  label,
  icon,
  ...rest
}: NavButtonProps) => {
  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <Button
          variant="ghost-on-accent"
          justifyContent="start"
          isActive={isActive}
          textTransform="capitalize"
          fontSize={16}
          {...rest}
        >
          <HStack spacing="3">
            <Icon as={icon} boxSize="6" />
            <Text>{label}</Text>
          </HStack>
        </Button>
      )}
    </NavLink>
  )
}
