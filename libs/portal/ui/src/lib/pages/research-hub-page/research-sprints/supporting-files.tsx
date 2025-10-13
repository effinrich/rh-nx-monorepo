import { MdLock, MdOpenInNew } from 'react-icons/md'
import { Link } from '@redesignhealth/ui'

interface SupportingFileProps {
  isConflict?: boolean
  name?: string
  link?: string
}

export const SupportingFile = ({
  isConflict,
  link,
  name
}: SupportingFileProps) => {
  return (
    <Link
      display="flex"
      href={link}
      isExternal
      pointerEvents={isConflict ? 'none' : 'auto'}
      color={isConflict ? 'gray.500' : 'primary.700'}
      textDecoration={isConflict ? 'none' : 'auto'}
      fontWeight="medium"
      gap={2}
      alignItems="center"
    >
      {name}
      {isConflict ? (
        <MdLock height="16px" width="16px" color="currentColor" />
      ) : (
        <MdOpenInNew />
      )}
    </Link>
  )
}
