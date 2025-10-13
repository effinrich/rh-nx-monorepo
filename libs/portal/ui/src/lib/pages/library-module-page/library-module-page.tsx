import { ReactNode /*, useState*/ } from 'react'
import { useNavigate } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import { type LibraryDoc } from '@redesignhealth/portal/data-assets'
import { Box, Flex, SectionHeader } from '@redesignhealth/ui'

import MobileNav from './mobile-nav'
import SideNav from './sidenav'

interface LibraryModulePageProps {
  title: string
  helpText?: string
  modules: LibraryDoc[]
  children: ReactNode
  currentModuleId?: string
}

export const LibraryModulePage = ({
  title,
  helpText,
  modules,
  currentModuleId,
  children
}: LibraryModulePageProps) => {
  const navigate = useNavigate()
  // const [sidebarIsScrolled, setSidebarIsScrolled] = useState(false)
  // const [mainIsScrolled, setmMainIsScrolled] = useState(false)

  const handleNavigateToModule = (module: LibraryDoc) => {
    analytics.sendSelectContentEvent({
      content_type: module.type.displayName,
      content_id: module.title
    })

    navigate(`/library/${module.parentId}/module/${module.id}`)
  }

  return (
    <Box as="section" w="full">
      <SectionHeader
        pb={6}
        title={title}
        helpText={helpText}
        isDivider={false}
      />
      <Flex height="100vh" flexDir={['column', 'column', 'row']}>
        <Box
          // borderRightWidth="1px"
          width="165px"
          display={{ base: 'none', md: 'initial' }}
          overflowY="auto"
          // onScroll={x => setSidebarIsScrolled(x.currentTarget.scrollTop > 32)}
        >
          <SideNav
            modules={modules}
            pt={2}
            onNavClick={handleNavigateToModule}
          />
        </Box>
        <Box width="100%" display={{ base: 'initial', md: 'none' }}>
          <MobileNav
            currentModuleId={currentModuleId}
            modules={modules}
            pt={6}
            onNavClick={handleNavigateToModule}
          />
        </Box>
        <Box
          flex="1"
          overflowY="auto"
          mt={[6, 6, 0]}
          pb="8"
          px={{ base: 0, md: 8 }}
          // onScroll={x => setmMainIsScrolled(x.currentTarget.scrollTop > 32)}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default LibraryModulePage
