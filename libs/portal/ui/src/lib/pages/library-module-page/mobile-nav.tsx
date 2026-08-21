import { ChangeEvent } from 'react'
import { type LibraryDoc } from '@redesignhealth/portal/data-assets'
import { type BoxProps, Box, NativeSelectField, NativeSelectRoot, Text } from '@redesignhealth/ui'

interface MobileNavProps extends BoxProps {
  modules: LibraryDoc[]
  currentModuleId?: string
  onNavClick: (module: LibraryDoc) => void
}

export const MobileNav = ({
  modules,
  currentModuleId,
  onNavClick,
  ...props
}: MobileNavProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const moduleId = event.target.value

    const selectedModule = modules.find(module => module.id === moduleId)
    onNavClick(selectedModule!)
  }

  return (
    <Box {...props}>
      <Text fontWeight="medium" fontSize="md" color="gray.500" pb={4}>
        IN THIS COLLECTION
      </Text>
      <NativeSelectRoot>
        <NativeSelectField
          onChange={event => handleOnChange(event)}
          defaultValue={currentModuleId}
        >
          <option value="">Select document</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </Box>
  )
}

export default MobileNav
