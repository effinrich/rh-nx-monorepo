import { IconType } from 'react-icons/lib'
import { NavLink } from 'react-router-dom'
import { Button, Flex, HStack, Icon, Link, Text } from '@redesignhealth/ui'

interface NavButtonProps {
  children: React.ReactNode
  icon: IconType
  to: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  isInternalLink?: boolean
  rightAddOn?: React.ReactNode
}

export const NavButton = ({
  children,
  icon,
  to,
  onClick,
  rightAddOn,
  isInternalLink = true
}: NavButtonProps) => {
  const innerButton = (isActive: boolean) => (
    <Button
      onClick={onClick}
      variant={isActive ? 'zap-on-accent' : 'ghost'}
      colorScheme="whiteAlpha"
      width="100%"
      justifyContent="start"
      size="sm"
      color={isActive ? undefined : 'white'}
    >
      <Flex justify="space-between" width="100%">
        <HStack spacing="3">
          <Icon as={icon} boxSize={5} />
          <Text>{children}</Text>
        </HStack>
        {rightAddOn}
      </Flex>
    </Button>
  )
  return isInternalLink ? (
    <NavLink to={to} end={to === '/'}>
      {({ isActive }) => innerButton(isActive)}
    </NavLink>
  ) : (
    <Link href={to} isExternal>
      {innerButton(false)}
    </Link>
  )
}
