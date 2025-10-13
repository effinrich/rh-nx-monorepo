import { MdEdit } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { useGetUserInfo } from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import {
  Badge,
  Box,
  Flex,
  Icon,
  IconButton,
  Loader,
  Text
} from '@redesignhealth/ui'
interface CompanyHeaderProps {
  companyId: string
  companyName: string
  status?: string
  number?: number
}
const CompanyHeader = ({
  companyName,
  status,
  number,
  companyId
}: CompanyHeaderProps) => {
  const { data: currentUser } = useGetUserInfo()
  return (
    <Flex justify="space-between">
      <Box>
        <Text
          as="h1"
          fontSize="30px"
          lineHeight="38px"
          fontWeight="500"
          color="gray.900"
        >
          <Flex alignItems="center" flexDir={{ base: 'column', md: 'row' }}>
            <Box>{companyName}</Box>
            <Box>
              <Badge
                ml={[0, 1]}
                colorScheme={status === 'ACTIVE' ? 'green' : 'red'}
                variant="outline"
              >
                {status}
              </Badge>
            </Box>
          </Flex>
        </Text>
        <Text
          as="p"
          aria-label="company number"
          fontSize="16px"
          lineHeight="24px"
          fontWeight="400"
          color="gray.500"
          mt="4px"
        >
          #{number}
        </Text>
      </Box>
      {currentUser ? (
        <HasRole
          currentRole={currentUser.role?.authority}
          allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
        >
          <Flex flexDir={{ base: 'column', md: 'row' }} gap="16px">
            <IconButton
              as={RouterLink}
              to={`/companies/${companyId}/overview/edit`}
              variant="outline"
              aria-label="Edit company"
              icon={<Icon as={MdEdit} />}
            />
          </Flex>
        </HasRole>
      ) : (
        <Loader />
      )}
    </Flex>
  )
}

export default CompanyHeader
