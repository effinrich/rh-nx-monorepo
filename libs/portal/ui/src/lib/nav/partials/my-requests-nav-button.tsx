import { MouseEventHandler } from 'react'
import { MdInbox } from 'react-icons/md'
import { useGetIPs, UserInfoSummary } from '@redesignhealth/portal/data-assets'
import { Circle } from '@redesignhealth/ui'

import { NavButton } from '../nav-button'

interface MyRequestsNavButtonProps {
  isEnterpriseSeller: boolean
  userInfo: UserInfoSummary
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const MyRequestsNavButton = ({
  isEnterpriseSeller,
  userInfo,
  onClick
}: MyRequestsNavButtonProps) => {
  const { data: ips } = useGetIPs(
    undefined,
    undefined,
    ['requests'],
    true,
    userInfo,
    true
  )
  const hasUnreleasedRequests = ips?.content?.some(ip =>
    ip.requestContactInfo?.some(contact => !contact.dateRelease)
  )

  return (
    <NavButton
      to="/my-requests"
      icon={MdInbox}
      onClick={onClick}
      rightAddOn={
        isEnterpriseSeller &&
        hasUnreleasedRequests && (
          <Circle
            bg="flame.500"
            size={2}
            alignSelf="center"
            data-testid="unreleased-ip-indicator"
          />
        )
      }
    >
      My Requests
    </NavButton>
  )
}

export default MyRequestsNavButton
