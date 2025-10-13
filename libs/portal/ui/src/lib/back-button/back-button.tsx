import { MdChevronLeft } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { type LinkProps, HStack, Icon, Link, Text } from '@redesignhealth/ui'

interface BackButtonProps extends LinkProps {
  children: React.ReactNode
  to?: string
}
const BackButton = ({ children, to, ...linkPops }: BackButtonProps) => {
  const navigate = useNavigate()
  const handleNavigateBack = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <Link
      onClick={handleNavigateBack}
      fontWeight="600"
      textDecoration="none"
      {...linkPops}
    >
      <HStack>
        <Icon as={MdChevronLeft} boxSize={4} />
        <Text>{children}</Text>
      </HStack>
    </Link>
  )
}

export default BackButton
