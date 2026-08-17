import { MdCorporateFare, MdEmail } from 'react-icons/md'
import { CardRoot, CardBody, Flex, Link, Text } from '@redesignhealth/ui'

import SecondaryText from './secondary-text'

interface CeoSummaryCardProps {
  name: string | undefined
  companyName?: string | undefined
  email: string | undefined
}

const CeoSummaryCard = ({ name, companyName, email }: CeoSummaryCardProps) => (
  <CardRoot variant="outline" colorPalette="purple" borderColor="primary.600">
    <CardBody>
      <Flex gap="2" direction="column">
        <Text as="b" fontSize="2xl" lineHeight={8}>
          {name}
        </Text>
        <Flex gap="2" direction="column">
          {companyName ? (
            <SecondaryText icon={MdCorporateFare} testid="companyName">
              {companyName}
            </SecondaryText>
          ) : (
            <Text data-testid="companyName">Not associated with a company</Text>
          )}
          <SecondaryText icon={MdEmail}>
            <Link target="_blank" rel="noopener noreferrer" href={`mailto:${email}`} data-testid="email">
              {email}
            </Link>
          </SecondaryText>
        </Flex>
      </Flex>
    </CardBody>
  </CardRoot>
)

export default CeoSummaryCard
