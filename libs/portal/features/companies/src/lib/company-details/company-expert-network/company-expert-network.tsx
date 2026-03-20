import { MdLaunch } from 'react-icons/md'
import { OverviewCard } from '@redesignhealth/portal/ui'
import { Button, Text } from '@redesignhealth/ui'

const EXPERT_NETWORK_HOSTNAME = import.meta.env.VITE_EXPERT_NETWORK_HOSTNAME
const CompanyExpertNetwork = () => {
  return (
    <OverviewCard
      title="Introducing the Expert Network"
      rightElement={
        <Button
          asChild
          colorPalette="primary"
        >
          <a href={EXPERT_NETWORK_HOSTNAME} target="_blank" rel="noreferrer">
            Search the network
            <MdLaunch />
          </a>
        </Button>
      }
    >
      <Text color="gray.600">
        We're building a new way to tap into expert knowledge. This feature lets
        you search for and request connection with prospective advisors. It's a
        first version, so share your thoughts and help us shape the future of
        expert access!
      </Text>
    </OverviewCard>
  )
}

export default CompanyExpertNetwork
