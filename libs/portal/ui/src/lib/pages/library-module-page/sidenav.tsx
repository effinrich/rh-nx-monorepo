import { useParams } from 'react-router-dom'
import { type LibraryDoc } from '@redesignhealth/portal/data-assets'
import { Link, Stack, StackProps, Text } from '@redesignhealth/ui'

interface SideNavProps extends StackProps {
  modules: LibraryDoc[]
  onNavClick: (module: LibraryDoc) => void
}

export const SideNav = ({ modules, onNavClick, ...props }: SideNavProps) => {
  const { moduleId } = useParams()

  return (
    <Stack spacing={1} {...props}>
      <Text fontWeight="medium" fontSize="xs" color="gray.500">
        IN THIS COLLECTION
      </Text>
      {modules.map(module => (
        <Link
          key={module.id}
          aria-current={module.id === moduleId ? 'page' : false}
          _hover={{
            textDecoration: 'none',
            bg: 'primary.50',
            color: 'primary.700'
          }}
          _activeLink={
            module.id === moduleId
              ? { bg: 'primary.50', color: 'primary.700' }
              : { bg: 'inherit', color: 'inherit' }
          }
          onClick={() => onNavClick(module)}
        >
          <Stack spacing="1" py={2} px={2} fontSize="sm" lineHeight="1.25rem">
            <Text fontWeight="medium">{module.title}</Text>
          </Stack>
        </Link>
      ))}
    </Stack>
  )
}

export default SideNav
