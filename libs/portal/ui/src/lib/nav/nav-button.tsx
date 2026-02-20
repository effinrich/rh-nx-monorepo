import type { IconType } from 'react-icons/lib'
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
      variant="ghost"
      width="100%"
      justifyContent="start"
      size="sm"
      color="white"
      bg={isActive ? 'whiteAlpha.300' : 'transparent'}
      fontWeight={isActive ? 'semibold' : 'medium'}
      _hover={{ bg: 'whiteAlpha.200' }}
      _active={{ bg: 'whiteAlpha.300' }}
    >
      <Flex justify="space-between" width="100%">
        <HStack gap="3">
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
    <Link href={to} target="_blank" rel="noopener noreferrer">
      {innerButton(false)}
    </Link>
  )
}
